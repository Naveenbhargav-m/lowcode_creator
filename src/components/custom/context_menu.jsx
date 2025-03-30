import { h } from 'preact';
import { useState } from 'preact/hooks';

//import './styles.css';

const ContextMenuDemo = ({ID,children}) => {
    const [bookmarksChecked, setBookmarksChecked] = useState(true);
    const [urlsChecked, setUrlsChecked] = useState(false);
    const [person, setPerson] = useState('pedro');
    console.log("context ID:",ID);
    return (
     <div>Need to be implemented</div>
    );
};

export default ContextMenuDemo;
