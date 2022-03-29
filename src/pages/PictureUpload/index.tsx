import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { uploadImage } from '@/services';

import type { RcFile } from 'antd/lib/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';

import s from './index.less';

const PictureUpload: React.FC<any> = (props) => {
  const { setImageUrl } = props;
  const [loading, setLoading] = useState(false);

  // 上传图片得类型
  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 / 1024 < 3;
    if (!isLt2M) {
      message.error('图片必须小于 3MB!');
      return false;
    }
    return true;
  };

  /**
   * 自定义上传
   * @param options
   */
  const customRequest = (options: UploadRequestOption) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', options.file);
    uploadImage(formData)
      .then((res) => {
        setImageUrl(res.data);
        message.success('🎉 上传成功了哦～');
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={s.uploadDiv}>
      <Upload
        showUploadList={false}
        beforeUpload={beforeUpload}
        accept=".jpeg, .png, .jpg"
        withCredentials
        customRequest={customRequest} //自定义上传
      >
        <Button loading={loading} icon={<UploadOutlined />}>
          上传 支持扩展名：jpg,jpeg,png
        </Button>
      </Upload>
    </div>
  );
};

export default PictureUpload;
