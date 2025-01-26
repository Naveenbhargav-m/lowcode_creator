import { h } from 'preact';
import { useState } from 'preact/hooks';
import * as ContextMenu from '@radix-ui/react-context-menu';

//import './styles.css';

const ContextMenuDemo = ({ID,children}) => {
    const [bookmarksChecked, setBookmarksChecked] = useState(true);
    const [urlsChecked, setUrlsChecked] = useState(false);
    const [person, setPerson] = useState('pedro');
    console.log("context ID:",ID);
    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger>
                {children}
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
                <ContextMenu.Content
                    className="ContextMenuContent"
                >
                    <ContextMenu.Item className="ContextMenuItem">
                        Undo  <div className="RightSlot">⌘+[</div>
                    </ContextMenu.Item>
                    <ContextMenu.Item className="ContextMenuItem">
                        Redo <div className="RightSlot">⌘+]</div>
                    </ContextMenu.Item>
                    <ContextMenu.Item className="ContextMenuItem">
                        Reset <div className="RightSlot">⌘+R</div>
                    </ContextMenu.Item>
                   
                    <ContextMenu.Separator className="ContextMenuSeparator" />

                    <ContextMenu.CheckboxItem
                        className="ContextMenuCheckboxItem"
                        checked={bookmarksChecked}
                        onCheckedChange={setBookmarksChecked}
                    >
                        Delete
                    </ContextMenu.CheckboxItem>

                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
};

export default ContextMenuDemo;
