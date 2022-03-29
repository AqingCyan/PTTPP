import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Slider, InputNumber, Switch } from 'antd';
import ProCard from '@ant-design/pro-card';
import PictureUpload from './PictureUpload';

enum ColorMode {
  colorful = 0,
  monochrome = 1,
}

const Index: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [base64Image, setBase64Image] = useState<string | undefined>(undefined);
  const [resultImage, setResultImage] = useState<string | undefined>(undefined);
  const [thresholdValue, setThresholdValue] = useState<number>(128);
  const [pixelScale, setPixelScale] = useState<number>(0.15);
  const [colorMode, setColorMode] = useState<ColorMode>(ColorMode.colorful);

  /**
   * 阈值处理
   * @param ctx
   * @param imageData 图片信息
   */
  const thresholdConvert = (ctx: CanvasRenderingContext2D, imageData: ImageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const alpha = data[i + 3];

      // 灰度计算公式
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      const handledColor = gray >= thresholdValue ? 255 : 0;
      const isColorful = colorMode === ColorMode.colorful;

      data[i] = isColorful && handledColor === 0 ? red : handledColor; // R
      data[i + 1] = isColorful && handledColor === 0 ? green : handledColor; // G
      data[i + 2] = isColorful && handledColor === 0 ? blue : handledColor; // B
      data[i + 3] = alpha >= thresholdValue ? 255 : 0; // A 去掉透明
    }
    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    if (base64Image) {
      const canvasTemp = document.createElement('canvas');
      const context = canvasTemp.getContext('2d');
      const tempImage = new Image();
      tempImage.src = base64Image;
      tempImage.onload = () => {
        canvasTemp.width = tempImage.width * pixelScale;
        canvasTemp.height = tempImage.height * pixelScale;
        // 缩小到 25%
        context!.drawImage(
          tempImage,
          0,
          0,
          tempImage.width * pixelScale,
          tempImage.height * pixelScale,
        );

        const imageData = context!.getImageData(
          0,
          0,
          tempImage.width * pixelScale,
          tempImage.height * pixelScale,
        );
        // 阈值处理
        thresholdConvert(context!, imageData);

        const dataURL = canvasTemp.toDataURL();
        setResultImage(dataURL);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas!.getContext('2d');
          const img = new Image();
          img.src = dataURL;
          img.onload = function () {
            canvas.width = img.width / pixelScale;
            canvas.height = img.height / pixelScale;

            // 抗锯齿
            ctx!.imageSmoothingEnabled = false;

            ctx!.drawImage(img, 0, 0, img.width / pixelScale, img.height / pixelScale);
          };
        }
      };
    }
  }, [base64Image, thresholdValue, colorMode, pixelScale]);

  return (
    <PageContainer title="Photo transform to pixel picture 🎨" footer={['Created by Cyan 🥰']}>
      <ProCard split="vertical">
        <ProCard
          title="配置图片"
          bodyStyle={{ height: window.innerHeight - 207, overflow: 'auto' }}
          colSpan="30%"
        >
          <PictureUpload
            setImageUrl={(data: TYPES.RemoveBgData) => {
              setBase64Image(`data:image/png;base64,${data.result_b64}`);
            }}
          />
          <div>
            <p style={{ marginTop: 30 }}>图像阀值</p>
            <div
              style={{
                display: 'flex',
                margin: '20px 20px 20px 0',
                alignItems: 'center',
              }}
            >
              <Slider
                min={1}
                max={255}
                step={1}
                onChange={(val) => setThresholdValue(val)}
                value={thresholdValue}
                style={{ width: '70%', margin: 0 }}
              />
              <InputNumber
                precision={0}
                min={1}
                max={255}
                value={thresholdValue}
                style={{ marginLeft: 20 }}
                onChange={(val) => setThresholdValue(val)}
              />
            </div>
          </div>
          <div>
            <p style={{ marginTop: 20 }}>像素缩放比</p>
            <div
              style={{
                display: 'flex',
                margin: '20px 20px 20px 0',
                alignItems: 'center',
              }}
            >
              <Slider
                max={1}
                min={0.01}
                step={0.01}
                value={pixelScale}
                onChange={(val) => setPixelScale(val)}
                style={{ width: '70%', margin: 0 }}
              />
              <InputNumber
                precision={2}
                max={1}
                min={0.01}
                value={pixelScale}
                onChange={(val) => setPixelScale(val)}
                style={{ marginLeft: 20 }}
              />
            </div>
          </div>
          <div>
            <p style={{ marginTop: 20 }}>色彩模式</p>
            <Switch
              checkedChildren="彩色"
              unCheckedChildren="黑白"
              checked={colorMode === ColorMode.colorful}
              onChange={(checked) =>
                setColorMode(checked ? ColorMode.colorful : ColorMode.monochrome)
              }
            />
          </div>
        </ProCard>
        <ProCard
          title="最终结果展示"
          headerBordered
          bodyStyle={{ padding: 0, position: 'relative' }}
        >
          <div
            style={{
              height: window.innerHeight - 265,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}
          >
            {/*{resultImage ? <img src={resultImage} alt="图片" style={{ height: '100%' }} /> : null}*/}
            <canvas ref={canvasRef} />
          </div>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default Index;
