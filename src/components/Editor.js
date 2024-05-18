import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/lib/codemirror.css';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        editorRef.current = Codemirror.fromTextArea(document.getElementById('real'), {
            mode: { name: 'javascript', json: true },
            theme: 'dracula',
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
        });

        editorRef.current = editorRef.current;

        editorRef.current.on('change', (instance, changes) => {
            const { origin } = changes;
            console.log('changes',changes);
            const code = instance.getValue();
            console.log(code);
            onCodeChange(code);
            if (origin !== 'setValue') {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
            console.log(code);
            
        });

        return () => {
            editorRef.current.toTextArea(); // Cleanup CodeMirror instance
        };
    }, [roomId, onCodeChange, socketRef]);

    return (
        <textarea id='real'></textarea>
    );
};

export default Editor;
