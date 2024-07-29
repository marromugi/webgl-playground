import type React from "react";
import { useEffect } from "react";
import * as THREE from "three";

export const useThreeSetup = (
  containerRef: React.RefObject<HTMLDivElement>,
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
    };

    // マテリアルを作成
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform float u_time;

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution;
          gl_FragColor = vec4(st.x, st.y, abs(sin(u_time)), 1.0);
        }
      `,
    });

    // メッシュを作成
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // ウィンドウリサイズイベントを設定
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);

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
      container.removeChild(renderer.domElement);
    };
  }, [containerRef]);
};
