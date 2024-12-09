import {getExcerptFromText} from "@helpers/formatters.js";
import {generateFile} from "@helpers/media.js";
import {formatDate} from "@helpers/dateTime.js";

const FileItem = ({ file, meta = false }) => {
    return(
        <>
            <div className="p-4 text-center">
                <div className="file-details mb-4 !inline-flex">
                    <span dangerouslySetInnerHTML={{__html: generateFile(file)}}/>
                </div>
                <div className="file-meta">
                    <p className="mb-0 font-semibold text-[1rem]">{ meta ? file.file_name : getExcerptFromText(file.file_name, 10)}</p>
                    <span className="file-checked-status">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M186.301 339.893L96 249.461l-32 30.507L186.301 402 448 140.506 416 110z"></path>
                  </svg>
                </span>
                    <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[.625rem]">{file.file_size}KB
                        | {formatDate(file.created_at)}</p>
                </div>
            </div>
        </>
    )
}

export default FileItem;