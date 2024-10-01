import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const EARTH_RADIUS = 6; // Base size in pixels

const PLANETS = [
  {
    name: 'Mercury',
    color: '#8C7853',
    orbitRadius: 60,
    speed: 4.1,
    sizeRatio: 0.383,
    info: 'Mercury is the closest planet to the Sun and the smallest planet in the solar system.',
    rotationSpeed: 0.02,
  },
  {
    name: 'Venus',
    color: '#FFA500',
    orbitRadius: 100,
    speed: 1.6,
    sizeRatio: 0.949,
    info: 'Venus is the second planet from the Sun and is the hottest planet in the solar system.',
    rotationSpeed: -0.01, // Venus rotates in the opposite direction
    atmosphere: true,
  },
  {
    name: 'Earth',
    color: '#1E90FF',
    orbitRadius: 140,
    speed: 1,
    sizeRatio: 1,
    info: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
    moons: [
      {
        name: 'Moon',
        orbitRadius: 15,
        speed: 13.2,
        sizeRatio: 0.273,
        color: '#C0C0C0',
      },
    ],
    rotationSpeed: 0.1,
    atmosphere: true,
  },
  {
    name: 'Mars',
    color: '#FF4500',
    orbitRadius: 180,
    speed: 0.5,
    sizeRatio: 0.532,
    info: 'Mars is the fourth planet from the Sun and is known as the Red Planet due to its reddish appearance.',
    moons: [
      {
        name: 'Phobos',
        orbitRadius: 10,
        speed: 21.2,
        sizeRatio: 0.011,
        color: '#A9A9A9',
      },
      {
        name: 'Deimos',
        orbitRadius: 20,
        speed: 9.1,
        sizeRatio: 0.006,
        color: '#808080',
      },
    ],
    rotationSpeed: 0.08,
    atmosphere: true,
  },
  {
    name: 'Jupiter',
    color: '#DEB887',
    orbitRadius: 220,
    speed: 0.08,
    sizeRatio: 11.209,
    info: 'Jupiter is the fifth planet from the Sun and the largest in the solar system.',
    moons: [
      {
        name: 'Io',
        orbitRadius: 25,
        speed: 17.3,
        sizeRatio: 0.286,
        color: '#FFD700',
      },
      {
        name: 'Europa',
        orbitRadius: 35,
        speed: 13.7,
        sizeRatio: 0.245,
        color: '#FFFFFF',
      },
      {
        name: 'Ganymede',
        orbitRadius: 45,
        speed: 10.9,
        sizeRatio: 0.413,
        color: '#D3D3D3',
      },
      {
        name: 'Callisto',
        orbitRadius: 55,
        speed: 8.2,
        sizeRatio: 0.378,
        color: '#A9A9A9',
      },
    ],
    rotationSpeed: 0.2,
    atmosphere: true,
  },
  {
    name: 'Saturn',
    color: '#F4A460',
    orbitRadius: 260,
    speed: 0.034,
    sizeRatio: 9.449,
    info: 'Saturn is the sixth planet from the Sun and is known for its prominent ring system.',
    moons: [
      {
        name: 'Titan',
        orbitRadius: 30,
        speed: 5.5,
        sizeRatio: 0.404,
        color: '#DAA520',
      },
    ],
    hasRings: true,
    rotationSpeed: 0.18,
    atmosphere: true,
  },
  {
    name: 'Uranus',
    color: '#40E0D0',
    orbitRadius: 300,
    speed: 0.012,
    sizeRatio: 4.007,
    info: 'Uranus is the seventh planet from the Sun and has a unique sideways rotation.',
    moons: [
      {
        name: 'Titania',
        orbitRadius: 25,
        speed: 4.2,
        sizeRatio: 0.123,
        color: '#D8BFD8',
      },
    ],
    rotationSpeed: 0.1,
    atmosphere: true,
  },
  {
    name: 'Neptune',
    color: '#4169E1',
    orbitRadius: 340,
    speed: 0.006,
    sizeRatio: 3.883,
    info: 'Neptune is the eighth planet from the Sun and is known for its deep blue color.',
    moons: [
      {
        name: 'Triton',
        orbitRadius: 20,
        speed: 3.9,
        sizeRatio: 0.212,
        color: '#87CEFA',
      },
    ],
    rotationSpeed: 0.12,
    atmosphere: true,
  },
  {
    name: 'Pluto',
    color: '#B0C4DE',
    orbitRadius: 380,
    speed: 0.004,
    sizeRatio: 0.186,
    info: 'Pluto is a dwarf planet in the Kuiper belt, a ring of bodies beyond Neptune.',
    moons: [
      {
        name: 'Charon',
        orbitRadius: 10,
        speed: 6.4,
        sizeRatio: 0.095,
        color: '#D3D3D3',
      },
    ],
    rotationSpeed: 0.05,
  },
];

const InfoBox = ({ x, y, name, info }) => {
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '300px',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <strong>{name}</strong>
      <p style={{ margin: 0 }}>{info}</p>
    </div>,
    document.body
  );
};

const Moon = ({ planetX, planetY, planetRadius, moon, isPaused, simulationSpeed }) => {
  const [angle, setAngle] = useState(Math.random() * 360);
  const requestRef = useRef();

  const animate = () => {
    if (!isPaused) {
      setAngle((prevAngle) => (prevAngle + moon.speed * simulationSpeed) % 360);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused, simulationSpeed]);

  const x = planetX + Math.cos((angle * Math.PI) / 180) * (planetRadius + moon.orbitRadius);
  const y = planetY + Math.sin((angle * Math.PI) / 180) * (planetRadius + moon.orbitRadius);
  const moonRadius = EARTH_RADIUS * moon.sizeRatio;

  return <circle cx={x} cy={y} r={moonRadius} fill={moon.color} />;
};

const Planet = ({
  cx,
  cy,
  r,
  color,
  speed,
  name,
  sizeRatio,
  info,
  moons = [],
  isPaused,
  simulationSpeed,
  hasRings,
  rotationSpeed,
  showOrbits,
  dateOffset,
  atmosphere,
}) => {
  const [angle, setAngle] = useState(Math.random() * 360);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const planetRef = useRef(null);
  const requestRef = useRef();
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });

  const animate = () => {
    if (!isPaused) {
      setAngle((prevAngle) => (prevAngle + speed * simulationSpeed) % 360);
      setRotationAngle((prev) => (prev + rotationSpeed * simulationSpeed) % 360);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused, simulationSpeed]);

  useEffect(() => {
    if (showInfo && planetRef.current) {
      const rect = planetRef.current.getBoundingClientRect();
      setInfoPosition({ x: rect.left + rect.width / 2, y: rect.top });
    }
  }, [showInfo]);

  const totalAngle = angle + dateOffset * speed;

  const x = cx + Math.cos((totalAngle * Math.PI) / 180) * r;
  const y = cy + Math.sin((totalAngle * Math.PI) / 180) * r;
  const planetRadius = EARTH_RADIUS * sizeRatio;

  return (
    <>
      <g
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setShowInfo(!showInfo)}
        style={{ cursor: 'pointer' }}
      >
        <g transform={`translate(${x}, ${y}) rotate(${rotationAngle})`}>
          {atmosphere && (
            <circle
              cx={0}
              cy={0}
              r={planetRadius * 1.1}
              fill={color}
              opacity="0.2"
              filter="url(#glow)"
            />
          )}
          <circle ref={planetRef} cx={0} cy={0} r={planetRadius} fill={color} />
          {hasRings && (
            <ellipse
              cx={0}
              cy={0}
              rx={planetRadius * 1.5}
              ry={planetRadius * 0.5}
              fill="none"
              stroke="#C2B280"
              strokeWidth="2"
            />
          )}
        </g>
        {moons.map((moon, index) => (
          <Moon
            key={index}
            planetX={x}
            planetY={y}
            planetRadius={planetRadius}
            moon={moon}
            isPaused={isPaused}
            simulationSpeed={simulationSpeed}
          />
        ))}
      </g>
      {hovered && (
        <text x={x} y={y - planetRadius - 10} fill="#fff" fontSize="12px" textAnchor="middle">
          {name}
        </text>
      )}
      {showInfo && <InfoBox x={infoPosition.x} y={infoPosition.y} name={name} info={info} />}
    </>
  );
};

const OrbitPath = ({ cx, cy, r }) => (
  <circle cx={cx} cy={cy} r={r} fill="none" stroke="#808080" strokeWidth="1" opacity="0.3" />
);

const Sun = ({ cx, cy }) => (
  <g>
    <defs>
      <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FFFF00" />
        <stop offset="100%" stopColor="#FFA500" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx={cx} cy={cy} r={40} fill="url(#sunGradient)" filter="url(#glow)" />
  </g>
);

const Controls = ({
  isPaused,
  setIsPaused,
  simulationSpeed,
  setSimulationSpeed,
  zoomLevel,
  setZoomLevel,
  showOrbits,
  setShowOrbits,
  dateOffset,
  setDateOffset,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 20,
      }}
    >
      <button onClick={() => setIsPaused(!isPaused)} style={{ marginRight: '10px' }}>
        {isPaused ? 'Play' : 'Pause'}
      </button>
      <label>
        Speed:
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={simulationSpeed}
          onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
          style={{ marginLeft: '5px', verticalAlign: 'middle' }}
        />
      </label>
      <label style={{ marginLeft: '10px' }}>
        Zoom:
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
          style={{ marginLeft: '5px', verticalAlign: 'middle' }}
        />
      </label>
      <label style={{ marginLeft: '10px' }}>
        Show Orbits:
        <input
          type="checkbox"
          checked={showOrbits}
          onChange={(e) => setShowOrbits(e.target.checked)}
          style={{ marginLeft: '5px', verticalAlign: 'middle' }}
        />
      </label>
      <label style={{ marginLeft: '10px' }}>
        Date Offset:
        <input
          type="range"
          min="-360"
          max="360"
          step="1"
          value={dateOffset}
          onChange={(e) => setDateOffset(parseFloat(e.target.value))}
          style={{ marginLeft: '5px', verticalAlign: 'middle', width: '100px' }}
        />
      </label>
    </div>
  );
};

const Stars = ({ width, height }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starArray = Array.from({ length: 500 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      opacity: Math.random(),
    }));
    setStars(starArray);
  }, [width, height]);

  return (
    <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      <rect width={width} height={height} fill="black" />
      {stars.map((star, index) => (
        <circle key={index} cx={star.x} cy={star.y} r={star.radius} fill="white" opacity={star.opacity} />
      ))}
    </svg>
  );
};

const AsteroidBelt = ({ cx, cy, innerRadius, outerRadius, numAsteroids }) => {
  const asteroids = useRef([]);

  useEffect(() => {
    asteroids.current = Array.from({ length: numAsteroids }, () => {
      const angle = Math.random() * 360;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      return { angle, radius };
    });
  }, [innerRadius, outerRadius, numAsteroids]);

  return (
    <g>
      {asteroids.current.map((asteroid, index) => {
        const x = cx + Math.cos((asteroid.angle * Math.PI) / 180) * asteroid.radius;
        const y = cy + Math.sin((asteroid.angle * Math.PI) / 180) * asteroid.radius;
        return <circle key={index} cx={x} cy={y} r={0.5} fill="#A9A9A9" />;
      })}
    </g>
  );
};

const Comet = ({ cx, cy, isPaused, simulationSpeed }) => {
  const [angle, setAngle] = useState(0);
  const requestRef = useRef();

  const animate = () => {
    if (!isPaused) {
      setAngle((prevAngle) => (prevAngle + 0.1 * simulationSpeed) % 360);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused, simulationSpeed]);

  const r = 400;
  const e = 0.7; // Eccentricity for elliptical orbit
  const a = r / (1 - e); // Semi-major axis

  const theta = (angle * Math.PI) / 180;
  const radius = (a * (1 - e ** 2)) / (1 + e * Math.cos(theta));

  const x = cx + Math.cos(theta) * radius;
  const y = cy + Math.sin(theta) * radius;

  return (
    <>
      <circle cx={x} cy={y} r={3} fill="#fff" />
      <path
        d={`M${x},${y} L${x - 20},${y - 20}`}
        stroke="#fff"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
    </>
  );
};

const SolarSystem = () => {
  const [svgWidth, setSvgWidth] = useState(window.innerWidth);
  const [svgHeight, setSvgHeight] = useState(window.innerHeight);
  const [isPaused, setIsPaused] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [dateOffset, setDateOffset] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSvgWidth(window.innerWidth);
      setSvgHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const centerX = svgWidth / 2 + offsetX;
  const centerY = svgHeight / 2 + offsetY;

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartDrag({ x: e.clientX, y: e.clientY });
    setCurrentOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = (e.clientX - startDrag.x) / zoomLevel;
      const dy = (e.clientY - startDrag.y) / zoomLevel;
      setOffsetX(currentOffset.x + dx);
      setOffsetY(currentOffset.y + dy);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <>
      <Controls
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        simulationSpeed={simulationSpeed}
        setSimulationSpeed={setSimulationSpeed}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        showOrbits={showOrbits}
        setShowOrbits={setShowOrbits}
        dateOffset={dateOffset}
        setDateOffset={setDateOffset}
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Stars width={svgWidth} height={svgHeight} />
        <svg
          viewBox={`${centerX - (svgWidth / 2) / zoomLevel} ${
            centerY - (svgHeight / 2) / zoomLevel
          } ${svgWidth / zoomLevel} ${svgHeight / zoomLevel}`}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {showOrbits &&
            PLANETS.map((planet, index) => (
              <OrbitPath key={`orbit-${index}`} cx={centerX} cy={centerY} r={planet.orbitRadius} />
            ))}
          <Sun cx={centerX} cy={centerY} />
          <AsteroidBelt cx={centerX} cy={centerY} innerRadius={190} outerRadius={210} numAsteroids={500} />
          {PLANETS.map((planet, index) => (
            <Planet
              key={`planet-${index}`}
              cx={centerX}
              cy={centerY}
              r={planet.orbitRadius}
              color={planet.color}
              speed={planet.speed}
              name={planet.name}
              sizeRatio={planet.sizeRatio}
              info={planet.info}
              moons={planet.moons}
              isPaused={isPaused}
              simulationSpeed={simulationSpeed}
              hasRings={planet.hasRings}
              rotationSpeed={planet.rotationSpeed}
              showOrbits={showOrbits}
              dateOffset={dateOffset}
              atmosphere={planet.atmosphere}
            />
          ))}
          <Comet cx={centerX} cy={centerY} isPaused={isPaused} simulationSpeed={simulationSpeed} />
        </svg>
      </div>
    </>
  );
};

export default SolarSystem;
