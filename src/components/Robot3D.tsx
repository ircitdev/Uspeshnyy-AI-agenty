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

const MODEL_URL = 'https://uspeshnyy.ru/assets/agenty3/robot_anim.glb';

// Клипы из модели. «wait» — покой между жестами, остальные показываем
// по кругу; «heart_pose» вне очереди, по нажатию.
const IDLE_CLIP = 'wait';
const HEART_CLIP = 'heart_pose';
const GESTURES = [
  'look_around', 'greet_02', 'sing_02', 'greet_04',
  'make_a_call_02', 'bow', 'dance_06',
];

interface Robot3DProps {
  className?: string;
  /** Вызывается, когда сцену не удалось запустить: нет WebGL или
      модель не загрузилась. Родитель показывает картинку вместо неё. */
  onFail?: () => void;
}

export const Robot3D: React.FC<Robot3DProps> = ({ className = '', onFail }) => {
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
      onFail?.();
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
    // Накопленный за жест путь и порог полного оборота.
    // Свободный угол поворота: во время жеста и по инерции после него.
    // pointer.x отвечает за слежение за курсором, а этот угол — за жест,
    // они складываются в кадре.
    let freeSpin = 0;
    let spinVel = 0;
    let spunBy = 0;
    let lastDragX = 0;
    // Порог «обернулся вокруг оси» — полный оборот в радианах.
    const SPIN_FULL = Math.PI * 2;
    // Ставится ниже, когда клипы уже загружены.
    let onFullSpin = () => {};

    const beginDrag = (x: number, y: number) => {
      dragging = true;
      dragStartX = x;
      dragStartY = y;
      dragBase = target.x;
      axisLocked = 'none';
      spunBy = 0;
      lastDragX = x;
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
      // Ширина экрана = один полный оборот: жест через весь экран
      // разворачивает модель кругом, как настоящий предмет в руке.
      const step = (x - lastDragX) / w * Math.PI * 2;
      lastDragX = x;
      // Путь считаем по модулю: оборот туда-обратно тоже засчитывается.
      spunBy += Math.abs(step);
      freeSpin += step;
      // Скорость для инерции — усредняем, касание приходит рывками.
      spinVel += (step - spinVel) * 0.4;
      return true;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      axisLocked = 'none';
      // Раскрутили вокруг оси — робот кланяется в ответ.
      if (spunBy >= SPIN_FULL) onFullSpin();
      spunBy = 0;
      target.x = 0;
      target.y = 0;
    };

    // iOS Safari: нативные touch-события, слушатель не passive —
    // иначе нельзя отменить прокрутку при горизонтальном жесте.
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

    // ── анимации ────────────────────────────────────────────────────────
    // Раньше жесты собирались вручную из углов костей и выглядели как
    // случайные рывки. Теперь в модели лежат готовые клипы — проигрываем их
    // микшером и переключаем с перекрёстным затуханием.
    let mixer: THREE.AnimationMixer | null = null;
    const clips = new Map<string, THREE.AnimationAction>();
    let current: THREE.AnimationAction | null = null;
    let queueIndex = 0;
    let nextGestureAt = 0;
    // Пока идёт жест, очередь ждёт его конца плюс паузу.
    let holdUntil = 0;

    // Вступление: после появления модель быстро делает три оборота
    // и плавно тормозит, передавая управление обычной логике.
    const SPIN_TURNS = 3;
    const SPIN_MS = 2600;
    let spinStart = 0;

    /** Переключает клип с плавным переходом. */
    const play = (name: string, fadeSec = 0.45, once = false) => {
      const next = clips.get(name);
      if (!next || next === current) return;
      next.reset();
      next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity);
      next.clampWhenFinished = once;
      next.enabled = true;
      next.setEffectiveWeight(1);
      if (current) next.crossFadeFrom(current, fadeSec, true);
      next.play();
      current = next;
    };

    // Нажатия по кругу: сердце, танец, два приветствия. Повторное нажатие
    // даёт новый ответ — с моделью хочется поиграть, а один и тот же жест
    // на третий раз уже не читается как реакция.
    const TAP_CLIPS = [HEART_CLIP, 'dance_06', 'greet_04', 'greet_02'];
    let tapIndex = 0;

    /** Играет клип вне очереди и отодвигает очередь на его длительность. */
    const playOnce = (name: string, fade = 0.3) => {
      const action = clips.get(name);
      if (!action) return false;
      // Тот же клип подряд play() пропустит — для нажатия это выглядит
      // как «робот не отреагировал». Поэтому сбрасываем текущий вручную.
      if (action === current) {
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
        holdUntil = performance.now() + action.getClip().duration * 1000;
        nextGestureAt = holdUntil + 900;
        return true;
      }
      play(name, fade, true);
      holdUntil = performance.now() + action.getClip().duration * 1000;
      nextGestureAt = holdUntil + 900;
      return true;
    };

    const showHeart = () => {
      // Клипа может не быть — тогда берём следующий, а не молчим.
      for (let i = 0; i < TAP_CLIPS.length; i += 1) {
        const name = TAP_CLIPS[(tapIndex + i) % TAP_CLIPS.length];
        if (playOnce(name)) {
          tapIndex = (tapIndex + i + 1) % TAP_CLIPS.length;
          return;
        }
      }
    };
    surfaceClickTarget.push(showHeart);
    onFullSpin = () => { playOnce('bow', 0.35); };

    const loader = new GLTFLoader();
    // Геометрия сжата EXT_meshopt_compression — подключаем декодер.
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      MODEL_URL,
      gltf => {
        if (disposed) return;
        model = gltf.scene;

        // Вписываем модель в кадр независимо от её исходного масштаба.
        // Геометрия сжата KHR_mesh_quantization — в буфере лежат целые
        // числа (±32767), настоящий размер даёт матрица узла. Box3 по
        // скиннед-мешу читает сырые координаты и даёт бокс в сотни тысяч
        // единиц, из-за чего модель ужималась в невидимую точку. Поэтому
        // меряем по костям: их мировые позиции уже учитывают все матрицы.
        model.updateWorldMatrix(true, true);
        const box = new THREE.Box3();
        let boneCount = 0;
        const bonePos = new THREE.Vector3();
        model.traverse(obj => {
          if (!(obj as THREE.Bone).isBone) return;
          obj.getWorldPosition(bonePos);
          box.expandByPoint(bonePos);
          boneCount += 1;
        });
        // Скелета нет (или модель не скиннута) — считаем по геометрии.
        if (boneCount < 2) box.setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        // 1.85: голова упиралась в верхний край кадра, а поднятая рука
        // выходила за правый — оставляем запас со всех сторон.
        // Бокс по суставам уже самой модели — корпус, плечи и голова
        // выходят за него, поэтому целевой размер берём меньше.
        const fit = (boneCount > 1 ? 1.45 : 1.85) / maxAxis;
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
          if (!mesh.isMesh) return;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat && 'envMapIntensity' in mat) {
            // У модели свои PBR-текстуры — цвета не трогаем, только слегка
            // поднимаем отклик на окружение, чтобы металл не выглядел плоским.
            mat.envMapIntensity = 1.2;
          }
          // Скелетный меш нельзя отсекать по исходному боксу: при подъёме
          // руки он вылезает за него и модель пропадает из кадра.
          mesh.frustumCulled = false;
        });

        // Клипы сняты с того же скелета, поэтому играются как есть.
        if (gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach(clip => {
            clips.set(clip.name, mixer!.clipAction(clip));
          });
          play(clips.has(IDLE_CLIP) ? IDLE_CLIP : gltf.animations[0].name, 0);
          nextGestureAt = performance.now() + 3000;
        }

        root.add(model);
        spinStart = performance.now();
      },
      undefined,
      () => { if (!disposed) { setFailed(true); onFail?.(); } }
    );

    let raf = 0;
    const clock = new THREE.Clock();

    let lastDraw = 0;
    const startedAt = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || !model) return;

      // 30 кадров в секунду в покое: движение плавное, нагрузка вдвое ниже.
      // Во время жеста и раскрутки по инерции — каждый кадр, иначе быстрое
      // вращение распадается на ступени.
      const now = performance.now();
      const spinning = dragging || Math.abs(spinVel) > 0.0005;
      if (!spinning && now - lastDraw < 33) return;
      lastDraw = now;

      // getDelta обнуляет счётчик, поэтому общее время держим отдельно.
      const t = (now - startedAt) / 1000;

      // Курсор догоняем с запозданием — движение читается живым, а не дёрганым.
      const follow = dragging ? 0.18 : 0.05;
      pointer.x += (target.x - pointer.x) * follow;
      pointer.y += (target.y - pointer.y) * follow;

      // Очередь жестов: покой, жест, снова покой. Пока клип играет,
      // ничего не переключаем — иначе движение обрывается на середине.
      if (!reduced && mixer) {
        const now2 = performance.now();
        if (now2 > holdUntil && now2 > nextGestureAt) {
          if (current && current.getClip().name !== IDLE_CLIP) {
            play(IDLE_CLIP, 0.5);
            nextGestureAt = now2 + 6000;
          } else if (GESTURES.length) {
            const name = GESTURES[queueIndex % GESTURES.length];
            queueIndex += 1;
            play(name, 0.45, true);
            const dur = clips.get(name)?.getClip().duration ?? 2;
            holdUntil = now2 + dur * 1000;
            nextGestureAt = holdUntil + 400;
          }
        }
        mixer.update(clock.getDelta());
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
        // Слежение за курсором ограничено ±25°, чтобы робот не отворачивался.
        // Жест пальцем не ограничен ничем: его угол живёт отдельно и
        // складывается сверху — так модель можно обернуть кругом.
        const MAX_YAW = 0.44;
        const sway = dragging ? 0 : Math.sin(t * 0.32) * 0.05;
        const look = Math.max(-MAX_YAW, Math.min(MAX_YAW, pointer.x * 0.34 + sway));

        if (dragging) {
          // Пока палец на модели — она слушается только его.
        } else if (Math.abs(spinVel) > 0.0005) {
          // Инерция: докручиваем и гасим, как настоящий волчок.
          freeSpin += spinVel;
          spinVel *= 0.94;
        } else {
          spinVel = 0;
          // Возвращаемся к ближайшему «лицом к зрителю», а не откручиваем
          // весь путь назад: оборот должен ощущаться завершённым.
          const turns = Math.round(freeSpin / (Math.PI * 2));
          freeSpin += (turns * Math.PI * 2 - freeSpin) * 0.04;
          if (Math.abs(freeSpin - turns * Math.PI * 2) < 0.002) {
            freeSpin = 0;
          }
        }

        root.rotation.y = look + freeSpin;
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
