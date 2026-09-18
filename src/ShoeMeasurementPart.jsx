import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import * as THREE from "three";

// 🎨 HOVER & DEFAULT HIGHLIGHT COLORS FOR LINES
const COLOR_CONFIG = {
  default: "#e2fbaf", // Volt Green Default
  hover: "#38bdf8",   // Electric Cyan Hover
};

const NON_CLICKABLE_KEYWORDS = ["SHOE"];

export default function ShoeMeasurementPart({
  partKey,
  position,
  rotation,
  scale,
  material,
  hoveredPart,
  onHoverPart,
  geometry,
  nodeType,
  spec,
}) {
  const meshRef = useRef();

  const displayTitle = partKey
    ? partKey
        .replace(/_/g, " ")
        .replace(/35MM/g, "3/5MM")
        .replace(/3 5MM/g, "3/5MM")
        .trim()
        .toUpperCase()
    : "";

  const isNonClickable = NON_CLICKABLE_KEYWORDS.some((keyword) =>
    displayTitle.includes(keyword)
  );

  const isHovered = hoveredPart === displayTitle && !isNonClickable;

  useCursor(isHovered, "pointer", "auto");

  const centerPosition = useMemo(() => {
    if (!geometry) return [0, 0, 0];
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    const c = new THREE.Vector3();
    geometry.boundingBox.getCenter(c);
    return [c.x, c.y, c.z];
  }, [geometry]);

  const clonedMaterial = useMemo(() => {
    if (!material) {
      return new THREE.MeshStandardMaterial({
        color: COLOR_CONFIG.default,
        roughness: 0.1,
        metalness: 0.0,
        transparent: false,
        opacity: 1.0,
      });
    }

    const mat = Array.isArray(material)
      ? material.map((m) => m.clone())
      : material.clone();

    const mats = Array.isArray(mat) ? mat : [mat];
    mats.forEach((m) => {
      if (isNonClickable) {
        // 🎯 LOCK SHOE MODEL TO OPAQUE
        m.transparent = false;
        m.opacity = 1.0;
        m.depthWrite = true;
      } else {
        // 🎯 LINES REMAIN TRANSPARENT FOR HOVER DISSOLVE
        m.transparent = true;
        m.depthWrite = true;
        if (m.color) m.color.set(COLOR_CONFIG.default);
      }
    });

    return mat;
  }, [material, isNonClickable]);

  useFrame(() => {
    if (!meshRef.current) return;

    const mats = Array.isArray(meshRef.current.material)
      ? meshRef.current.material
      : [meshRef.current.material];

    mats.forEach((mat) => {
      if (!mat) return;

      // 🎯 SHOE MODEL STAYS FULLY OPAQUE AT ALL TIMES
      if (isNonClickable) {
        mat.opacity = 1.0;
        mat.transparent = false;
        return;
      }

      // 🎯 MEASUREMENT LINES DYNAMIC FADE & HOVER HIGHLIGHT
      if (isHovered) {
        mat.opacity = 1.0;
        if ("color" in mat && mat.color) mat.color.set(COLOR_CONFIG.hover);
        if ("emissive" in mat && mat.emissive) {
          mat.emissive.set(COLOR_CONFIG.hover);
          mat.emissiveIntensity = 0.9;
        }
      } else {
        mat.opacity = hoveredPart ? 0.2 : 0.85;
        if ("color" in mat && mat.color) mat.color.set(COLOR_CONFIG.default);
        if ("emissive" in mat && mat.emissive) {
          mat.emissive.set(COLOR_CONFIG.default);
          mat.emissiveIntensity = 0.35;
        }
      }
    });
  });

  let ComponentType = "mesh";
  if (nodeType === "LineSegments") {
    ComponentType = "lineSegments";
  } else if (nodeType === "Line") {
    ComponentType = "line";
  }

  return (
    <ComponentType
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={geometry}
      material={clonedMaterial}
      raycast={isNonClickable ? () => {} : THREE.Mesh.prototype.raycast}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isNonClickable) onHoverPart(displayTitle);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (!isNonClickable) onHoverPart(null);
      }}
    >
      {!isNonClickable && spec && isHovered && (
        <Html
          position={centerPosition}
          center
          style={{
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          <div className="line-3d-badge hovered">
            <span className="badge-spec men">M: {spec.men}</span>
            <span className="badge-divider">|</span>
            <span className="badge-spec women">W: {spec.women}</span>
          </div>
        </Html>
      )}
    </ComponentType>
  );
}