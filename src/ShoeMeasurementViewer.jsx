import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  Component,
} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import ShoeMeasurementPart from './ShoeMeasurementPart';
import './styles.css';

const NON_CLICKABLE_KEYWORDS = ['SHOE'];

const SHOE_TABS = [
  {
    id: 'road-running',
    label: 'PERFORMANCE EVERYDAY',
    modelPath:
      'https://raw.githubusercontent.com/kyrastratford/On_3D-Assets/main/shoe_measurement standards.glb',
    measurements: {
      'VAMP LENGTH': { men: '77 - 82 mm', women: '67 - 72 mm' },
      'TONGUE LENGTH': { men: '20 mm', women: '16 mm' },
      'COLLAR OPENING': { men: '100 - 105 mm', women: '90 - 95 mm' },
      'BACK HEIGHT': { men: '84 mm', women: '76 mm' },
      'QUARTER HEIGHT (+3/5MM MEDIAL QUARTER)': {
        men: 'LAT 58mm MED +3mm',
        women: 'LAT 54mm MED +3mm',
      },
      'TOP EYESTAY HEIGHT': {
        men: 'MED 85 - LAT 90mm',
        women: 'MED 75 - LAT 80mm',
      },
      'QUARTER HEIGHT MEASURING POSITION': { men: '47.5 mm', women: '41 mm' },
      'BOTTOM EYESTAY WIDTH MEASURED AT BOTTOM EYELET': {
        men: '40 mm',
        women: '35 mm',
      },
      'TOP EYESTAY WIDTH MEASURED AT TOP EYELET': {
        men: '45 mm',
        women: '40 mm',
      },
    },
  },
  {
    id: 'trail',
    label: 'PERFORMANCE RUNNING',
    modelPath:
      'https://raw.githubusercontent.com/kyrastratford/On_3D-Assets/main/Clound Runner measurements_V01-optimized.glb',
    measurements: {
      'VAMP LENGTH': { men: '80 mm', women: '65 mm' },
      'TONGUE LENGTH': { men: '20 mm', women: '16 mm' },
      'COLLAR OPENING': { men: '100 mm', women: '90 mm' },
      'BACK HEIGHT': { men: '84 mm', women: '76 mm' },
      'QUARTER HEIGHT (+3/5MM MEDIAL QUARTER)': {
        men: 'LAT 58mm MED +3mm',
        women: 'LAT 54mm MED +3mm',
      },
      'TOP EYESTAY HEIGHT': {
        men: 'MED 85 - LAT 90mm',
        women: 'MED 75 - LAT 80mm',
      },
      'QUARTER HEIGHT MEASURING POSITION': { men: '47.5 mm', women: '41 mm' },
      'BOTTOM EYESTAY WIDTH MEASURED AT BOTTOM EYELET': {
        men: '40 mm',
        women: '35 mm',
      },
      'TOP EYESTAY WIDTH MEASURED AT TOP EYELET': {
        men: '45 mm',
        women: '40 mm',
      },
    },
  },
  {
    id: 'lifestyle',
    label: 'PERFORMANCE TENNIS',
    modelPath:
      'https://raw.githubusercontent.com/kyrastratford/On_3D-Assets/main/The Roger_measurements_V03-optimized.glb',
    measurements: {
      'VAMP LENGTH': { men: '82 mm', women: '72 mm' },
      'TONGUE LENGTH': { men: '20 mm', women: '16 mm' },
      'COLLAR OPENING': { men: '95 mm', women: '85 mm' },
      'BACK HEIGHT': { men: '84 mm', women: '76 mm' },
      'QUARTER HEIGHT (+3/5MM MEDIAL QUARTER)': {
        men: 'LAT 58mm MED +3mm',
        women: 'LAT 54mm MED +3mm',
      },
      'TOP EYESTAY HEIGHT': {
        men: 'MED 88 - LAT 93mm',
        women: 'MED 78 - LAT 83mm',
      },
      'QUARTER HEIGHT MEASURING POSITION': { men: '47.5 mm', women: '41 mm' },
      'BOTTOM EYESTAY WIDTH MEASURED AT BOTTOM EYELET': {
        men: '40 mm',
        women: '35 mm',
      },
      'TOP EYESTAY WIDTH MEASURED AT TOP EYELET': {
        men: '48 mm',
        women: '43 mm',
      },
    },
  },
  {
    id: 'track-field',
    label: 'PERFORMANCE OUTDOOR',
    modelPath:
      'https://raw.githubusercontent.com/kyrastratford/On_3D-Assets/main/Cloud Rock Measurements_V01-optimized.glb',
    measurements: {
      'VAMP LENGTH': { men: '80 mm', women: '68 mm' },
      'TONGUE LENGTH': { men: '16-20 mm', women: '14-18 mm' },
      'COLLAR OPENING': { men: '107 mm', women: '97 mm' },
      'BACK HEIGHT': { men: '120 mm', women: '110 mm' },
      'QUARTER HEIGHT (+3/5MM MEDIAL QUARTER)': {
        men: '143 mm',
        women: '120 mm',
      },
      'TOP EYESTAY HEIGHT': { men: '153 mm', women: '130 mm' },
      'QUARTER HEIGHT MEASURING POSITION': {
        men: '1/4 of Last Length',
        women: '1/4 of Last Length',
      },
      'BOTTOM EYESTAY WIDTH MEASURED AT BOTTOM EYELET': {
        men: '45 mm',
        women: '35 mm',
      },
      'TOP EYESTAY WIDTH MEASURED AT TOP EYELET': {
        men: '75 mm',
        women: '60 mm',
      },
    },
  },
  {
    id: 'tennis',
    label: 'PERFORMANCE TRAINING',
    modelPath:
      'https://raw.githubusercontent.com/kyrastratford/On_3D-Assets/main/Clound Pulse measurements_V01-optimized.glb',
    measurements: {
      'VAMP LENGTH': { men: '82 mm', women: '70 mm' },
      'TONGUE LENGTH': { men: '18 mm', women: '14 mm' },
      'COLLAR OPENING': { men: '100 mm', women: '90 mm' },
      'BACK HEIGHT': { men: '84 mm', women: '76 mm' },
      'QUARTER HEIGHT (+3/5MM MEDIAL QUARTER)': {
        men: 'LAT 58mm MED +3mm',
        women: 'LAT 54mm MED +3mm',
      },
      'TOP EYESTAY HEIGHT': {
        men: 'MED 85 - LAT 90mm',
        women: 'MED 75 - LAT 80mm',
      },
      'QUARTER HEIGHT MEASURING POSITION': { men: '47.5 mm', women: '41 mm' },
      'BOTTOM EYESTAY WIDTH MEASURED AT BOTTOM EYELET': {
        men: '40 mm',
        women: '35 mm',
      },
      'TOP EYESTAY WIDTH MEASURED AT TOP EYELET': {
        men: '45 mm',
        women: '40 mm',
      },
    },
  },
];

class CanvasErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bottom-hud-container">
          <div className="glass-callout">
            <span>⚠️ WebGL re-rendering recovered.</span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ShoeModel({
  modelPath,
  measurements,
  hoveredPart,
  setHoveredPart,
  onPartsExtracted,
}) {
  const { nodes, materials } = useGLTF(modelPath);

  useEffect(() => {
    if (!nodes) return;
    const validParts = Object.keys(nodes)
      .filter((nodeName) => {
        const node = nodes[nodeName];
        if (!node || (!node.isMesh && !node.isLine && !node.isLineSegments))
          return false;
        const upper = nodeName
          .replace(/_/g, ' ')
          .replace(/35MM/g, '3/5MM')
          .replace(/3 5MM/g, '3/5MM')
          .trim()
          .toUpperCase();

        if (NON_CLICKABLE_KEYWORDS.some((k) => upper.includes(k))) return false;

        // 🎯 FILTER OUT ANY MEASUREMENT LINE WITHOUT VALID NUMBERS
        const spec = measurements[upper];
        return spec && (spec.men || spec.women);
      })
      .map((nodeName) =>
        nodeName
          .replace(/_/g, ' ')
          .replace(/35MM/g, '3/5MM')
          .replace(/3 5MM/g, '3/5MM')
          .trim()
          .toUpperCase()
      );

    const uniqueParts = Array.from(new Set(validParts));
    if (onPartsExtracted) {
      onPartsExtracted(uniqueParts);
    }
  }, [nodes, measurements, onPartsExtracted]);

  return (
    <group dispose={null}>
      {Object.keys(nodes).map((nodeName) => {
        const node = nodes[nodeName];
        if (!node || (!node.isMesh && !node.isLine && !node.isLineSegments))
          return null;

        const displayTitle = nodeName
          .replace(/_/g, ' ')
          .replace(/35MM/g, '3/5MM')
          .replace(/3 5MM/g, '3/5MM')
          .trim()
          .toUpperCase();

        const isShoeMesh = NON_CLICKABLE_KEYWORDS.some((k) =>
          displayTitle.includes(k)
        );

        const spec = measurements[displayTitle];

        // 🎯 DO NOT RENDER 3D LINES THAT HAVE EMPTY MEASUREMENT VALUES
        if (!isShoeMesh && (!spec || (!spec.men && !spec.women))) {
          return null;
        }

        return (
          <ShoeMeasurementPart
            key={nodeName}
            partKey={nodeName}
            geometry={node.geometry}
            material={node.material || materials[node.material?.name]}
            position={node.position}
            rotation={node.rotation}
            scale={node.scale}
            hoveredPart={hoveredPart}
            onHoverPart={setHoveredPart}
            nodeType={node.type}
            spec={spec}
          />
        );
      })}
    </group>
  );
}

export default function ShoeMeasurementViewer() {
  const [activeTabId, setActiveTabId] = useState('road-running');
  const [hoveredPart, setHoveredPart] = useState(null);
  const [partsList, setPartsList] = useState([]);

  const currentTab =
    SHOE_TABS.find((t) => t.id === activeTabId) || SHOE_TABS[0];

  const handlePartsExtracted = useCallback((extractedList) => {
    setPartsList(extractedList);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTabId(tabId);
    setHoveredPart(null);
    setPartsList([]);
  };

  return (
    <div className="app-container">
      <div className="viewport-matrix">
        <div className="top-tab-container">
          <nav className="tab-bar">
            {SHOE_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTabId === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <aside className="sidebar-panel">
          <div className="sidebar-header">
            <h3>{currentTab.label.toUpperCase()}</h3>
            <span className="sidebar-count">{partsList.length} SPECS</span>
          </div>

          <div className="sidebar-list">
            {partsList.map((partName) => {
              const isHovered = hoveredPart === partName;

              return (
                <div
                  key={partName}
                  className={`sidebar-btn ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredPart(partName)}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <div className="sidebar-btn-top">
                    <span className="indicator-dot" />
                    <span className="btn-text">{partName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="canvas-wrapper">
          <CanvasErrorBoundary>
            <Canvas
              gl={{ toneMapping: THREE.NoToneMapping }}
              raycaster={{ params: { Line: { threshold: 0.08 } } }}
              camera={{ position: [0, 0, 2.2], fov: 45 }}
              onPointerMissed={() => setHoveredPart(null)}
            >
              <color attach="background" args={['#050508']} />

              <ambientLight intensity={1.0} />
              <directionalLight position={[10, 15, 10]} intensity={1.5} />

              <Suspense fallback={null}>
                <Center scale={0.004}>
                  <group scale={[-1, 1, 1]} rotation={[0, Math.PI, 0]}>
                    <ShoeModel
                      key={currentTab.id}
                      modelPath={currentTab.modelPath}
                      measurements={currentTab.measurements}
                      hoveredPart={hoveredPart}
                      setHoveredPart={setHoveredPart}
                      onPartsExtracted={handlePartsExtracted}
                    />
                  </group>
                </Center>
              </Suspense>

              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                makeDefault
              />
            </Canvas>
          </CanvasErrorBoundary>
        </div>
      </div>
    </div>
  );
}

SHOE_TABS.forEach((tab) => useGLTF.preload(tab.modelPath));
