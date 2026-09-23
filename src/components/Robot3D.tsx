import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

/**
 * 3D-бюст робота в hero.
 *
 * Модель следит за курсором поворотом головы, мягко «дышит» и медленно
 * покачивается — живой собеседник, а не картинка. Свет поставлен под бренд:
 * холодный ключевой сверху-слева, голубой контровой сзади, тёплая заливка.
 *
 * Грузится лениво (см. Hero.tsx). Пока модель едет — ничего не показываем,
 * первый экран не должен ждать.
 */

const MODEL_URL = 'https://uspeshnyy.ru/assets/agenty3/robot_rigged.glb';

interface Robot3DProps {
  className?: string;
}

export const Robot3D: React.FC<Robot3DProps> = ({ className = '' }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    } catch {
      setFailed(true);
      return;
    }

    // Подписчики на нажатие по модели: сам жест добавляется ниже,
    // когда объявлены кости и состояние анимации.
    const surfaceClickTarget: Array<() => void> = [];

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // На телефоне держим 1.5x: разница на глаз незаметна, а нагрузка
    // на мобильный GPU заметно ниже.
    const narrow = window.matchMedia('(max-width: 1023px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    // Горизонтальные жесты обрабатываем сами, вертикальные отдаём странице.
    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.style.pointerEvents = 'auto';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    // ── свет под бренд ──────────────────────────────────────────────────
    // Ключевой сверху-слева даёт объём, голубой контровой сзади отделяет
    // силуэт от фона, слабая заливка снизу убирает провалы в тенях.
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-2.5, 3, 3.5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x38bdf8, 3.2);
    rim.position.set(2.5, 1.2, -3);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0x9ec9e2, 0.7);
    fill.position.set(1.5, -2, 2);
    scene.add(fill);

    scene.add(new THREE.AmbientLight(0xbcd7e8, 0.55));

    // Точечный акцент бренда возле груди — оживляет металл бликом.
    const accent = new THREE.PointLight(0x33a4d4, 8, 6, 2);
    accent.position.set(0, -0.4, 1.6);
    scene.add(accent);

    const root = new THREE.Group();
    scene.add(root);

    // ── курсор ──────────────────────────────────────────────────────────
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      // Только мышь. Safari шлёт pointer-события параллельно с touch,
      // и слежение за курсором перетирало target.x при каждом движении
      // пальца — вращение перетаскиванием не работало вовсе.
      if (e.pointerType !== 'mouse') return;
      if (dragging) return;
      const r = host.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const onPointerLeave = () => {
      if (dragging) return;
      target.x = 0;
      target.y = 0;
    };

    // ── вращение пальцем ──────────────────────────────────────────────
    // На телефоне курсора нет, поэтому моделью управляют перетаскиванием.
    // Safari на iOS не отдаёт pointer-события для canvas так, как Chrome:
    // setPointerCapture там работает иначе, а passive-слушатель не даёт
    // отменить прокрутку. Поэтому слушаем нативные touch-события,
    // а pointer оставляем для остальных браузеров.
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragBase = 0;
    let axisLocked: 'none' | 'x' | 'y' = 'none';

    const beginDrag = (x: number, y: number) => {
      dragging = true;
      dragStartX = x;
      dragStartY = y;
      dragBase = target.x;
      axisLocked = 'none';
    };

    const moveDrag = (x: number, y: number): boolean => {
      if (!dragging) return false;
      const dx = x - dragStartX;
      const dy = y - dragStartY;
      // Направление определяем по первому заметному сдвигу: горизонталь —
      // вращаем модель, вертикаль — отдаём прокрутку странице.
      if (axisLocked === 'none') {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return false;
        axisLocked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (axisLocked !== 'x') return false;
      const w = host.clientWidth || 1;
      const raw = Math.max(-1, Math.min(1, dragBase + (dx / w) * 2.2));
      // Координаты касания приходят рывками — усредняем, иначе модель дрожит.
      target.x += (raw - target.x) * 0.5;
      return true;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      axisLocked = 'none';
      target.x = 0;
      target.y = 0;
    };

    // iOS Safari: нативные touch-события, слушатель не passive —
    // иначе нельзя отменить прокрутку при горизонтальном жесте.
    // Нажатие на модель — благодарность в ответ. Держим три секунды,
    // потом робот возвращается к обычной очереди жестов.
    const showHeart = () => {
      heartUntil = performance.now() + 3000;
      gestureTarget = 1;
    };
    surfaceClickTarget.push(showHeart);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      beginDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const rotated = moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      if (rotated && e.cancelable) e.preventDefault();
    };

    const surface = renderer.domElement;
    const onSurfaceClick = () => surfaceClickTarget.forEach(fn => fn());
    surface.style.cursor = 'pointer';
    surface.addEventListener('click', onSurfaceClick, { passive: true });
    surface.addEventListener('touchstart', onTouchStart, { passive: true });
    surface.addEventListener('touchmove', onTouchMove, { passive: false });
    surface.addEventListener('touchend', endDrag, { passive: true });
    surface.addEventListener('touchcancel', endDrag, { passive: true });

    // Прочие тач-устройства (Android, стилус) — через pointer.
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'touch') return;
      beginDrag(e.clientX, e.clientY);
    };
    const onPointerDrag = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'touch') return;
      moveDrag(e.clientX, e.clientY);
    };

    host.addEventListener('pointerdown', onPointerDown, { passive: true });
    host.addEventListener('pointermove', onPointerDrag, { passive: true });
    host.addEventListener('pointerup', endDrag, { passive: true });
    host.addEventListener('pointercancel', endDrag, { passive: true });

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    host.addEventListener('pointerleave', onPointerLeave, { passive: true });


    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Рисуем только пока сцена в экране и вкладка активна.
    let visible = true;
    const io = new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0 });
    io.observe(host);

    let model: THREE.Object3D | null = null;
    let disposed = false;

    // ── жест «показывает пальцем» ───────────────────────────────────────
    // Анимаций в модели нет, поэтому строим жест сами по костям Mixamo:
    // плечо и предплечье поднимают руку, пальцы складываются в указание.
    type BoneKey =
      | 'shoulder' | 'arm' | 'foreArm' | 'hand' | 'index1' | 'middle1' | 'ring1' | 'pinky1' | 'head'
      | 'lShoulder' | 'lArm' | 'lForeArm' | 'lHand' | 'lIndex1' | 'lMiddle1' | 'lRing1' | 'lPinky1' | 'lThumb1';
    const bones: Partial<Record<BoneKey, THREE.Object3D>> = {};
    const rest: Partial<Record<BoneKey, THREE.Euler>> = {};

    // Целевая поза: отклонения от исходной, в радианах.
    type Pose = Partial<Record<BoneKey, [number, number, number]>>;

    // Жест 1: правая рука вперёд, указательный палец вытянут.
    const POSE_POINT: Pose = {
      shoulder: [0, 0, -0.35],
      arm: [-0.15, 0.1, -0.95],
      foreArm: [0, -0.45, -0.55],
      hand: [0.15, 0, -0.2],
      middle1: [1.3, 0, 0],
      ring1: [1.35, 0, 0],
      pinky1: [1.4, 0, 0],
    };

    // Жест 2: левая рука поднята, палец вверх — «всё получится».
    // Кости левой стороны зеркальны, поэтому знаки по Z обратные.
    // Кости направлены по локальной оси Y (проверено по translation детей),
    // поэтому подъём руки — это поворот по Z у плеча и сгиб локтя по X.
    // Прежний вариант вращал по Z и уводил руку назад.
    const POSE_THUMB: Pose = {
      lShoulder: [0, 0, -0.25],
      lArm: [0, 0, -1.35],
      lForeArm: [-1.25, 0, -0.2],
      lHand: [0, 0, 0.1],
      lIndex1: [1.4, 0, 0],
      lMiddle1: [1.45, 0, 0],
      lRing1: [1.45, 0, 0],
      lPinky1: [1.5, 0, 0],
      lThumb1: [0, 0, -0.35],
    };

    // Вступление: после появления модель быстро делает три оборота
    // и плавно тормозит, передавая управление обычной логике.
    const SPIN_TURNS = 3;
    const SPIN_MS = 2600;
    let spinStart = 0;

    // Сердце двумя руками: кисти сходятся перед грудью, пальцы согнуты
    // навстречу друг другу. Кости идут по локальной оси Y, поэтому подъём
    // рук — поворот по Z, а сведение к центру — по X у предплечий.
    const POSE_HEART: Pose = {
      shoulder: [0, 0, -0.2],
      arm: [0, 0, -0.75],
      foreArm: [-1.5, 0, -0.35],
      hand: [0, 0.5, -0.6],
      index1: [0.9, 0, 0],
      middle1: [1.0, 0, 0],
      ring1: [1.1, 0, 0],
      pinky1: [1.2, 0, 0],

      lShoulder: [0, 0, 0.2],
      lArm: [0, 0, 0.75],
      lForeArm: [-1.5, 0, 0.35],
      lHand: [0, -0.5, 0.6],
      lIndex1: [0.9, 0, 0],
      lMiddle1: [1.0, 0, 0],
      lRing1: [1.1, 0, 0],
      lPinky1: [1.2, 0, 0],
      lThumb1: [0, 0, -0.2],
    };

    // Два жеста чередуются: указание правой рукой, затем палец вверх левой.
    // 0 — покой, 1 — поза показана целиком.
    const SEQUENCE: Pose[] = [POSE_POINT, POSE_THUMB];
    let poseIndex = 0;
    let gesture = 0;
    let gestureTarget = 0;
    let nextGestureAt = performance.now() + 2600;
    // Сердце показывается по нажатию и перебивает обычную очередь жестов.
    let heartUntil = 0;

    const loader = new GLTFLoader();
    // Геометрия сжата EXT_meshopt_compression — подключаем декодер.
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      MODEL_URL,
      gltf => {
        if (disposed) return;
        model = gltf.scene;

        // Вписываем модель в кадр независимо от её исходного масштаба.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        // 1.85: голова упиралась в верхний край кадра, а поднятая рука
        // выходила за правый — оставляем запас со всех сторон.
        const fit = 1.85 / maxAxis;
        model.scale.setScalar(fit);
        model.position.sub(center.multiplyScalar(fit));
        // Смещаем вниз: сверху оставался пустой воздух, а корпус упирался
        // в нижний край кадра.
        model.position.y += 0.12;
        // Модель приходит развёрнутой спиной — ставим лицом к зрителю.
        // Доворот на четверть: после риггинга модель вставала вполоборота,
        // одного разворота на 180° не хватало.
        model.rotation.y = Math.PI * 1.5;

        model.traverse(obj => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && 'envMapIntensity' in mat) {
              // У модели свои PBR-текстуры — цвета не трогаем, только слегка
              // поднимаем отклик на окружение, чтобы металл не выглядел плоским.
              mat.envMapIntensity = 1.2;
            }
            // Скелетный меш нельзя отсекать по исходному боксу: при подъёме
            // руки он вылезает за него и модель пропадает из кадра.
            mesh.frustumCulled = false;
          }
          // Кости скелета Mixamo — по ним строим жест.
          const n = obj.name;
          if (n.endsWith('RightShoulder')) bones.shoulder = obj;
          else if (n.endsWith('RightArm')) bones.arm = obj;
          else if (n.endsWith('RightForeArm')) bones.foreArm = obj;
          else if (n.endsWith('RightHand')) bones.hand = obj;
          else if (n.endsWith('RightHandIndex1')) bones.index1 = obj;
          else if (n.endsWith('RightHandMiddle1')) bones.middle1 = obj;
          else if (n.endsWith('RightHandRing1')) bones.ring1 = obj;
          else if (n.endsWith('RightHandPinky1')) bones.pinky1 = obj;
          else if (n.endsWith('LeftShoulder')) bones.lShoulder = obj;
          else if (n.endsWith('LeftArm')) bones.lArm = obj;
          else if (n.endsWith('LeftForeArm')) bones.lForeArm = obj;
          else if (n.endsWith('LeftHand')) bones.lHand = obj;
          else if (n.endsWith('LeftHandIndex1')) bones.lIndex1 = obj;
          else if (n.endsWith('LeftHandMiddle1')) bones.lMiddle1 = obj;
          else if (n.endsWith('LeftHandRing1')) bones.lRing1 = obj;
          else if (n.endsWith('LeftHandPinky1')) bones.lPinky1 = obj;
          else if (n.endsWith('LeftHandThumb1')) bones.lThumb1 = obj;
          else if (n.endsWith('Head')) bones.head = obj;
        });

        // Запоминаем исходные повороты: жест — это отклонение от них.
        (Object.keys(bones) as BoneKey[]).forEach(k => {
          const b = bones[k];
          if (b) rest[k] = b.rotation.clone();
        });

        root.add(model);
        spinStart = performance.now();
      },
      undefined,
      () => { if (!disposed) setFailed(true); }
    );

    let raf = 0;
    const clock = new THREE.Clock();

    let lastDraw = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || !model) return;

      // 30 кадров в секунду: движение плавное, нагрузка вдвое ниже.
      const now = performance.now();
      if (!dragging && now - lastDraw < 33) return;
      lastDraw = now;

      const t = clock.getElapsedTime();

      // Курсор догоняем с запозданием — движение читается живым, а не дёрганым.
      const follow = dragging ? 0.18 : 0.05;
      pointer.x += (target.x - pointer.x) * follow;
      pointer.y += (target.y - pointer.y) * follow;

      // Жест повторяется циклом: поднял — подержал — опустил — пауза.
      if (!reduced) {
        const now2 = performance.now();
        if (now2 < heartUntil) {
          // сердце держим целиком, не переключаясь на следующий жест
          gestureTarget = 1;
        } else if (now2 > nextGestureAt) {
          if (gestureTarget > 0.5) {
            // опускаем руку, держим паузу и переходим к следующему жесту
            gestureTarget = 0;
            nextGestureAt = now2 + 6000;
            poseIndex = (poseIndex + 1) % SEQUENCE.length;
          } else {
            gestureTarget = 1;
            nextGestureAt = now2 + 3600;
          }
        }
        // 0.022 вместо 0.045: движение вдвое медленнее и спокойнее.
        gesture += (gestureTarget - gesture) * 0.022;

        // Сбрасываем все кости в покой, затем накладываем текущую позу —
        // иначе прошлый жест «залипал» при переключении.
        (Object.keys(rest) as BoneKey[]).forEach(k => {
          const b = bones[k];
          const r0 = rest[k];
          if (b && r0) b.rotation.copy(r0);
        });

        // Пока держится сердце — показываем его, очередь ждёт.
        const heartActive = now2 < heartUntil;
        const pose = heartActive ? POSE_HEART : SEQUENCE[poseIndex];
        (Object.keys(pose) as BoneKey[]).forEach(k => {
          const b = bones[k];
          const r0 = rest[k];
          const v = pose[k];
          if (!b || !r0 || !v) return;
          b.rotation.set(
            r0.x + v[0] * gesture,
            r0.y + v[1] * gesture,
            r0.z + v[2] * gesture
          );
        });
      }

      if (reduced) {
        root.rotation.set(0, 0, 0);
      } else {
        // поворот к курсору + едва заметное покачивание и «дыхание»
        // Вступительная раскрутка: три оборота с торможением по ease-out
        // (степень 3 даёт естественное замедление к концу).
        const spinElapsed = spinStart ? performance.now() - spinStart : SPIN_MS;
        if (spinElapsed < SPIN_MS) {
          const k = spinElapsed / SPIN_MS;
          const eased = 1 - Math.pow(1 - k, 3);
          root.rotation.y = Math.PI * 2 * SPIN_TURNS * (1 - eased) * -1;
          root.rotation.x = 0;
          renderer.render(scene, camera);
          return;
        }

        // Поворот ограничен ±25°: робот отслеживает курсор взглядом,
        // но никогда не отворачивается от зрителя.
        // Пальцем разрешаем довернуть сильнее: это осознанное действие,
        // в отличие от слежения за курсором.
        const MAX_YAW = dragging ? 1.1 : 0.44;
        const gain = dragging ? 1.1 : 0.34;
        // Пока тянут пальцем, покачивание выключаем: наложение синусоиды
        // на жест читалось как дрожание модели.
        const sway = dragging ? 0 : Math.sin(t * 0.32) * 0.05;
        const yaw = pointer.x * gain + sway;
        root.rotation.y = Math.max(-MAX_YAW, Math.min(MAX_YAW, yaw));
        const pitch = -pointer.y * 0.16 + (dragging ? 0 : Math.sin(t * 0.45) * 0.02);
        root.rotation.x = Math.max(-0.2, Math.min(0.2, pitch));
        root.position.y = dragging ? 0 : Math.sin(t * 0.8) * 0.045;
      }

      // акцентный свет дышит вместе с моделью
      accent.intensity = 7 + Math.sin(t * 1.6) * 1.6;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      host.removeEventListener('pointerleave', onPointerLeave);
      surface.removeEventListener('click', onSurfaceClick);
      surface.removeEventListener('touchstart', onTouchStart);
      surface.removeEventListener('touchmove', onTouchMove);
      surface.removeEventListener('touchend', endDrag);
      surface.removeEventListener('touchcancel', endDrag);
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointermove', onPointerDrag);
      host.removeEventListener('pointerup', endDrag);
      host.removeEventListener('pointercancel', endDrag);
      scene.traverse(obj => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const m = mesh.material;
        if (Array.isArray(m)) m.forEach(x => x.dispose());
        else m?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  if (failed) return null;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      // pointer-events-auto: иначе палец не дотянется до модели.
      // touch-action: pan-y оставляет вертикальную прокрутку странице —
      // крутим робота горизонтально, листаем вертикально.
      style={{ touchAction: 'pan-y', WebkitUserSelect: 'none', userSelect: 'none' }}
      className={`absolute inset-0 ${className}`}
    />
  );
};

export default Robot3D;
