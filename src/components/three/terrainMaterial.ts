import * as THREE from "three";

/**
 * TERRAIN MATERIAL
 *
 * The Everest model ships with Google satellite imagery baked into its base
 * colour. Dropped in raw, it looks like a screenshot of a map — photographic,
 * grey-brown, and completely disconnected from an identity built on flat navy
 * rock, white snow and warm paper.
 *
 * So the imagery is not used as colour. It is used as *data*: its luminance
 * stands in for how lit and how bare each part of the mountain is, and that
 * single channel is remapped through the Logosa ramp — deep ink in the
 * shadowed gullies, Himalayan blue on the rock, haze on the high shoulders,
 * white on the snow. Elevation adds its own snowline, and faint contour lines
 * in gold give the whole thing the register of a printed atlas rather than a
 * game asset.
 *
 * The result reads as the logo's mountains, drawn by real terrain.
 */

export interface TerrainUniforms {
  /** 0 → dissolved into paper, 1 → fully present. Driven by scroll. */
  reveal: number;
  /** World-space Y bounds of the mesh, for the elevation ramp. */
  minY: number;
  maxY: number;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying float vElevation;
  varying float vViewZ;
  varying float vHeight;

  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);

    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vHeight = worldPos.y;
    vElevation = (worldPos.y - uMinY) / max(uMaxY - uMinY, 0.0001);

    vec4 mvPosition = viewMatrix * worldPos;
    vViewZ = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uInkDeep;
  uniform vec3 uInk;
  uniform vec3 uHaze;
  uniform vec3 uGlacier;
  uniform vec3 uSnow;
  uniform vec3 uPaper;
  uniform vec3 uGold;
  uniform vec3 uLightDir;
  uniform float uSnowLine;
  uniform float uContourSpacing;
  uniform float uContourOpacity;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uReveal;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying float vElevation;
  varying float vViewZ;
  varying float vHeight;

  void main() {
    vec3 tex = texture2D(uMap, vUv).rgb;
    float lum = dot(tex, vec3(0.2126, 0.7152, 0.0722));

    // Satellite imagery of a snowfield is bimodal — blown-out snow and black
    // shadow, with very little between. Left alone it reads as a photograph
    // with crushed blacks. Normalising the working range and lifting the
    // midtones spreads it back out so the ramp below has something to grade.
    lum = clamp((lum - 0.06) / 0.74, 0.0, 1.0);
    lum = pow(lum, 0.72);

    // Luminance → the identity's ramp. Four stops, matching the logo's own
    // reading of a mountain: gully, rock, lit shoulder, snow.
    vec3 col = uInkDeep;
    col = mix(col, uInk,     smoothstep(0.02, 0.34, lum));
    col = mix(col, uHaze,    smoothstep(0.32, 0.62, lum));
    col = mix(col, uGlacier, smoothstep(0.62, 0.82, lum));
    col = mix(col, uSnow,    smoothstep(0.84, 0.97, lum));

    // Snow by elevation, but only where it could actually settle. Steep faces
    // stay bare rock, which is what stops this reading as icing on a cake.
    // Kept light, because the imagery already carries most of the real snow —
    // stacking the two is what blows the whole range out to white.
    float slope = smoothstep(0.34, 0.82, vNormalW.y);
    float snow = smoothstep(uSnowLine, uSnowLine + 0.2, vElevation) * slope;
    col = mix(col, uSnow, snow * 0.4);

    // One hard light from the left, matching the sun in the logo, with a
    // generous ambient floor so shadowed rock stays navy rather than black.
    float ndl = max(dot(normalize(vNormalW), normalize(uLightDir)), 0.0);
    col *= 0.74 + 0.38 * ndl;

    // Contour lines by elevation — the atlas register. Kept faint and gold.
    // d is the distance to the nearest contour, so the line sits ON the
    // interval rather than everywhere between intervals.
    float e = vHeight / uContourSpacing;
    float w = fwidth(e);
    float f = fract(e);
    float d = min(f, 1.0 - f);
    float line = 1.0 - smoothstep(0.0, max(w * 1.5, 0.001), d);
    // Contours drawn on a near-vertical face would smear into a wash, so they
    // fade out wherever the ground is too steep to carry them legibly, and
    // wherever it is too dark for a gold line to be anything but noise.
    line *= smoothstep(0.15, 0.55, vNormalW.y) * smoothstep(0.18, 0.5, lum);
    col = mix(col, uGold, clamp(line, 0.0, 1.0) * uContourOpacity);

    // Nothing in this identity is black. Whatever the imagery does, the
    // darkest ground on the page is still Himalayan blue.
    col = max(col, uInkDeep * 0.92);

    // Aerial perspective: distance dissolves toward paper, so the model sits
    // on the page instead of floating in a void.
    float fog = smoothstep(uFogNear, uFogFar, vViewZ) * 0.82;
    col = mix(col, uPaper, fog);

    // The tile is a rectangle cut out of a survey, and its edges are a hard
    // cliff of geometry. Dissolving them into paper turns that limitation into
    // the language of the site: a plate torn from an atlas, not a floating slab.
    float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    col = mix(uPaper, col, smoothstep(0.0, 0.07, edge));

    // Scroll-driven reveal, from paper to mountain.
    col = mix(uPaper, col, clamp(uReveal, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);

    // Everything above is computed in linear space: the texture is uploaded
    // as sRGB so sampling returns linear, and the palette is converted on the
    // way in. three only injects the output conversion where this include
    // appears, and a custom ShaderMaterial does not get it for free — without
    // it, linear values are written straight to an sRGB target and the whole
    // scene renders muddy and desaturated.
    #include <colorspace_fragment>
  }
`;

const c = (hex: string) => new THREE.Color(hex).convertSRGBToLinear();

export function createTerrainMaterial(map: THREE.Texture) {
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  return new THREE.ShaderMaterial({
    vertexShader: `uniform float uMinY; uniform float uMaxY;\n${vertexShader}`,
    fragmentShader,
    uniforms: {
      uMap: { value: map },
      uInkDeep: { value: c("#0e3a52") },
      uInk: { value: c("#1a5c7d") },
      uHaze: { value: c("#7ba4c4") },
      uGlacier: { value: c("#d6e4f0") },
      uSnow: { value: c("#ffffff") },
      uPaper: { value: c("#f7f4ec") },
      uGold: { value: c("#fdb614") },
      uLightDir: { value: new THREE.Vector3(-0.65, 0.72, 0.45) },
      uSnowLine: { value: 0.55 },
      uContourSpacing: { value: 0.075 },
      uContourOpacity: { value: 0.1 },
      uFogNear: { value: 5.4 },
      uFogFar: { value: 14.5 },
      uReveal: { value: 1 },
      uMinY: { value: 0 },
      uMaxY: { value: 1 },
    },
    // The terrain tile is a single-sided sheet; the source marks it
    // double-sided, which doubles fill for nothing.
    side: THREE.FrontSide,
  });
}

export type TerrainMaterial = ReturnType<typeof createTerrainMaterial>;
