var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Upload } from 'antd';
// import ImgCrop from 'antd-img-crop'; // Commented out due to React 19 compatibility issues
import './addservice.css';
const UploadPicture = () => {
    const [fileList, setFileList] = useState([]);
    //   {
    //     uid: '-1',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    // ]);
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const onPreview = (file) => __awaiter(void 0, void 0, void 0, function* () {
        let src = file.url;
        if (!src) {
            src = yield new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow === null || imgWindow === void 0 ? void 0 : imgWindow.document.write(image.outerHTML);
    });
    return (_jsx(Upload, { action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", listType: "picture-card", fileList: fileList, onChange: onChange, onPreview: onPreview, className: "custom-upload", children: fileList.length < 1 && '+ Upload' }));
};
export default UploadPicture;
