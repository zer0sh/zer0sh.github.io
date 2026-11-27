import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { KestrelCloudDemo } from './demos/KestrelCloudDemo';
import { VerveAiDemo } from './demos/VerveAiDemo';
import { ForgeConfDemo } from './demos/ForgeConfDemo';
import { PixelcraftDemo } from './demos/PixelcraftDemo';
import { TerraWildDemo } from './demos/TerraWildDemo';
import { AetherisDemo } from './demos/AetherisDemo';
import { SolsticeArchDemo } from './demos/SolsticeArchDemo';
import { LuminaPayDemo } from './demos/LuminaPayDemo';
import { StrideKicksDemo } from './demos/StrideKicksDemo';

const DEMO_MAP = {
  'kestrel-cloud': KestrelCloudDemo,
  'verve-ai': VerveAiDemo,
  forgeconf: ForgeConfDemo,
  pixelcraft: PixelcraftDemo,
  terrawild: TerraWildDemo,
  aetheris: AetherisDemo,
  'solstice-arch': SolsticeArchDemo,
  'lumina-pay': LuminaPayDemo,
  'stride-kicks': StrideKicksDemo,
};

export const LandingDemoRouter = () => {
  const { slug } = useParams();
  const DemoComponent = DEMO_MAP[slug];

  if (!DemoComponent) {
    return <Navigate to="/landings" replace />;
  }

  return <DemoComponent />;
};
