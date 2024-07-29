import type React from "react";
import { useEffect } from "react";
import * as THREE from "three";
import frag from "./shaders/frag.glsl";
import vert from "./shaders/vert.glsl";

export const useThreeSetup = (
  containerRef: React.RefObject<HTMLDivElement>,
  isRecording: boolean,
  setMediaRecorder: (recorder: MediaRecorder) => void
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 2;

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // ジオメトリを作成
    const geometry = new THREE.PlaneGeometry(2, 2);

    // ユニフォームを定義
    const uniforms = {
      u_resolution: {
        type: "v2",
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      u_time: { type: "f", value: 1.0 },
      u_mouse: { type: "v2", value: new THREE.Vector2() },
    };

    // マテリアルを作成
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vert,
      fragmentShader: frag,
    });

    // メッシュを作成
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // マウスムーブイベントを設定
    const onMouseMove = (event: MouseEvent) => {
      uniforms.u_mouse.value.set(
        event.clientX,
        window.innerHeight - event.clientY,
      );
    };

    // ウィンドウリサイズイベントを設定
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousemove", onMouseMove);

    let mediaRecorder: MediaRecorder | null = null;
    if (isRecording) {
      const stream = (renderer.domElement as HTMLCanvasElement).captureStream();
      mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
    }

    // アニメーションループを開始
    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.u_time.value += 0.05;
      renderer.render(scene, camera);
    };

    animate();

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeChild(renderer.domElement);
    };
  }, [containerRef, isRecording, setMediaRecorder]);
};
