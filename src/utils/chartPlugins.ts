export const customCanvasBackgroundColor = {
  id: 'customCanvasBackgroundColor',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeDraw: (chart: any, args: any, options: any) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#ffffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};
