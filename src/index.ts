import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'imageUrl': '图片URL',
        'imageAttachment': '图片附件',
        'invalidUrl': '无效的图片URL'
      },
      'en-US': {
        'imageUrl': 'Image URL',
        'imageAttachment': 'Image Attachment',
        'invalidUrl': 'Invalid Image URL'
      },
      'ja-JP': {
        'imageUrl': '画像URL',
        'imageAttachment': '画像添付',
        'invalidUrl': '無効な画像URL'
      },
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'imageUrl',
      label: t('imageUrl'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text, FieldType.Url],
      },
      validator: {
        required: true,
      }
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Attachment,
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { imageUrl: { type: string; text: string; link: string }[] }, context) => {
    const imageUrlObj = formItemParams.imageUrl?.[0];
    const imageUrl = imageUrlObj?.link || ''; // 从对象中提取实际URL链接
    /** 为方便查看日志，使用此方法替代console.log */
    function debugLog(arg: any) {
      // @ts-ignore
      console.log(JSON.stringify({
        formItemParams,
        context,
        arg
      }))
    }
    try {
      if (typeof imageUrl !== 'string' || !imageUrl) {
        debugLog({
          '===1 错误': t('invalidUrl'),
          '实际类型': typeof imageUrl,
          '原始数据': formItemParams.imageUrl
        });
        return {
          code: FieldCode.Success,
          data: [{ name: '错误', content: '', contentType: 'attachment/url' }]
        };
      }
      // 可选：验证URL是否可访问（示例中注释掉，实际可根据需求开启）
      // const response = await context.fetch(imageUrl, { method: 'HEAD' });
      // if (!response.ok) throw new Error('URL不可访问');
      const fileName = imageUrl.split('/').pop() || 'image.jpg';
      return {
        code: FieldCode.Success,
        data: [{
          name: fileName,
          content: imageUrl,
          contentType: 'attachment/url'
        }]
      };
    } catch (e) {
      console.log('====error', String(e));
      debugLog({
        '===999 异常错误': String(e)
      });
      return {
        code: FieldCode.Error,
      };
    }
  }
});
export default basekit;
