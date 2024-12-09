import videoIcon from "@assets/images/icon/007-video-file.png";
import zipIcon from "@assets/images/icon/005-zip-2.png";
import pdfIcon from "@assets/images/icon/002-pdf-file-format-symbol.png";
import wordIcon from "@assets/images/icon/010-word.png";
import excelIcon from "@assets/images/icon/011-excel-file.png";
import powerpointIcon from "@assets/images/icon/powerpoint.png";
import fileIcon from "@assets/images/icon/008-file.png";

export function generateFile(file) {
    if (file){
        const {file_type, small_url, file_name} = file;
        let imgStyle = '';
        if (file_type.substr(0, 5) !== 'image') {
            imgStyle = 'height: 40px;width: 40px;';
        }

        if (file_type.substr(0, 5) === 'image') {
            return `<img style="object-fit: contain" src="${small_url}" alt="${file_name}">`;
        }

        // Check file type and return corresponding representation
        if (file_type.substr(0, 5) === 'video') {
            return `<img src="${videoIcon}" alt="${file_name}" style="${imgStyle}">`;
        }

        if (file.file_type.indexOf('x-zip-compressed') !== -1 || file.file_type.indexOf('/zip') !== -1) {
            return `<img src="${zipIcon}" alt="${file_name}" style="${imgStyle}">`;
        }

        if (file.file_type.indexOf('/pdf') !== -1) {
            return `<img src="${pdfIcon}" alt="${file_name}" style="${imgStyle}">`;
        }

        if (file.file_type.indexOf('/msword') !== -1 || file.file_type.indexOf('wordprocessingml') !== -1) {
            return `<img src="${wordIcon}" alt="${file_name}" style="${imgStyle}">`;
        }

        if (file.file_type.indexOf('spreadsheetml') !== -1 || file.file_type.indexOf('excel') !== -1) {
            return `<img src="${excelIcon}" alt="${file_name}" style="${imgStyle}">`;
        }

        if (file.file_type.indexOf('presentation') !== -1) {
            return `<img src="${powerpointIcon}" alt="${file_name}" style="${imgStyle}">`;
        }

        if (file.file_type.indexOf('audio') !== -1 || file.file_type.substr(0, 5) === 'audio') {
            return '<audio controls style="width: 60px;margin-top:35px">' +
                '<source src="' + file.small_url + '" type="' + file.file_type + '">' +
                '</audio>';
        }

        return `<img src="${fileIcon}" alt="${file_name}" style="${imgStyle}">`;
    }
}