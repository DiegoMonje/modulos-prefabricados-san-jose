import type Konva from 'konva';

export const exportStageAsPng = (stage: Konva.Stage | null, pixelRatio = 2) => {
  if (!stage) return null;
  return stage.toDataURL({ pixelRatio, mimeType: 'image/png' });
};
