import SunEditor from 'suneditor-react';

const FormEditor = ({height = '200px', placeholder = 'Start typing...', initialValue = '', onChange = () => {},}) => {
    return (
        <div className="sun-editor-wrapper">
            <SunEditor
                setOptions={{
                    height: height,
                    placeholder: placeholder,
                }}
                defaultValue={initialValue}
                onChange={onChange}
            />
        </div>
    );
};

export default FormEditor;
