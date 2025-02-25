import * as React from 'react';
import clsx from 'clsx';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { RichTreeView } from '@mui/x-tree-view';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import {
    TreeItem2Checkbox,
    TreeItem2Content,
    TreeItem2IconContainer,
    TreeItem2Label,
    TreeItem2Root,
    TreeItem2GroupTransition,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';

import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

import { useAuthStore } from '../store/useAuthStore'
import axios from 'axios';
import { Loader } from 'lucide-react';

const ITEMS = [
    {
        id: '1',
        label: 'Documents',
        fileType: 'folder',
        children: [
            {
                id: '1.1',
                label: 'Company',
                fileType: 'folder',
                children: [
                    { id: '1.1.1', label: 'Invoice', fileType: 'pdf' },
                    { id: '1.1.2', label: 'Meeting notes', fileType: 'doc' },
                    {
                        id: '1.1.6',
                        label: 'JS',
                        fileType: 'folder',
                        children: [
                            { id: '1.1.6.1', label: 'JS', fileType: 'js' },
                            { id: '1.1.6.2', label: 'JS', fileType: 'js' },
                        ]
                    },
                    { id: '1.1.3', label: 'Tasks list', fileType: 'doc' },
                    { id: '1.1.4', label: 'Equipment', fileType: 'pdf' },
                    { id: '1.1.5', label: 'Video conference', fileType: 'video' },
                ],
            },
            { id: '1.2', label: 'Personal', fileType: 'folder' },
            { id: '1.3', label: 'Group photo', fileType: 'image' },
        ],
    },
    {
        id: '2',
        label: 'Bookmarked',
        fileType: 'folder',
        children: [
            { id: '2.1', label: 'Learning materials', fileType: 'folder' },
            { id: '2.2', label: 'News', fileType: 'folder' },
            { id: '2.3', label: 'Forums', fileType: 'folder' },
            { id: '2.4', label: 'Travel documents', fileType: 'pdf' },
        ],
    },
    { id: '3', label: 'History', fileType: 'folder' },
    { id: '4', label: 'Trash', fileType: 'trash' },
];

const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase(); // Extract file extension

    const fileTypes = {
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",
        json: "json",
        html: "html",
        css: "css",
        scss: "scss",
        less: "less",
        xml: "xml",
        yaml: "yaml",
        yml: "yaml",
        md: "markdown",
        py: "python",
        java: "java",
        c: "c",
        cpp: "cpp",
        cs: "csharp",
        php: "php",
        rb: "ruby",
        go: "go",
        swift: "swift",
        kt: "kotlin",
        rs: "rust",
        sh: "shell",
        sql: "sql",
    };

    return fileTypes[extension] || "Unknown File Type"; // Default fallback
};

function DotIcon() {
    return (
        <Box
            sx={{
                width: 6,
                height: 6,
                borderRadius: '70%',
                bgcolor: 'warning.main',
                display: 'inline-block',
                verticalAlign: 'middle',
                zIndex: 1,
                mx: 1,
            }}
        />
    );
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
    color: theme.palette.grey[400],
    position: 'relative',
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: theme.spacing(3.5),
    },
    ...theme.applyStyles('light', {
        color: theme.palette.grey[800],
    }),
}));
const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
    flexDirection: 'row-reverse',
    borderRadius: theme.spacing(0.7),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    fontWeight: 500,
    [`&.Mui-expanded `]: {
        '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
            color: theme.palette.primary.dark,
            ...theme.applyStyles('light', {
                color: theme.palette.primary.main,
            }),
        },
        '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: '16px',
            top: '44px',
            height: 'calc(100% - 48px)',
            width: '1.5px',
            backgroundColor: theme.palette.grey[700],
            ...theme.applyStyles('light', {
                backgroundColor: theme.palette.grey[300],
            }),
        },
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: 'white',
        ...theme.applyStyles('light', {
            color: theme.palette.primary.main,
        }),
    },
    [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        ...theme.applyStyles('light', {
            backgroundColor: theme.palette.primary.main,
        }),
    },
}));

const StyledTreeItemLabelText = styled(Typography)({
    color: 'inherit',
    fontFamily: 'General Sans',
    fontWeight: 500,
});

function CustomLabel({ icon: Icon, expandable, fileType, itemId, publicAPI, link, children, ...other }) {

    const getPath = (itemId) => {
        let path = [];
        let current = itemId;
        while (current.length > 0) {
            const item = publicAPI.getItem(current).label;
            path.unshift(item);
            current = current.substr(0, current.length - 2)
        }
        return path.join('/');
    }

    const { setEditorValue, setEditorLanguage, setEditorFilePath, setEditorLoader, editorLoader } = useAuthStore();

    const handleFileClick = async () => {
        if (fileType === 'folder') return;
        // console.log("children", children);
        // console.log("Item Id: ", itemId);
        // console.log("File type: ", fileType);
        // console.log("Path: ", getPath(itemId))
        // console.log("Link: ", link)
        // console.log(editorValue)

        try {
            setEditorLoader({state: true, label: children})
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/getFileRawData`, { params: { link: link } });

            if (children.endsWith('.json')) {
                setEditorValue(JSON.stringify(response.data.fileData, null, 2))
            } else {
                setEditorValue(response.data.fileData)
            }

            // console.log("File Type: ", getFileType(children))
            setEditorLanguage(getFileType(children))
            setEditorFilePath(getPath(itemId))
        } catch (err) {
            console.log(err);
        } finally{
            setEditorLoader({state: false, label: ''})
        }
    }

    return (
        <TreeItem2Label
            {...other}
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
            onClick={handleFileClick}
        >
            <div className='flex justify-between w-full'>
                <div className='flex'>
                    {Icon && (
                        <Box
                            component={Icon}
                            className="labelIcon"
                            color="inherit"
                            sx={{ mr: 1, fontSize: '1.2rem' }}
                        />
                    )}

                    <StyledTreeItemLabelText variant="body2">{children}</StyledTreeItemLabelText>
                    {expandable && <DotIcon />}
                </div>

                <div className='text-black'>
                    {(editorLoader.state && editorLoader.label == children ) && <Loader size={20} strokeWidth={1.75} className='animate-spin' />}
                </div>
            </div>
        </TreeItem2Label>
    );
}

const isExpandable = (reactChildren) => {
    if (Array.isArray(reactChildren)) {
        return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
};

const getIconFromFileType = (fileType) => {
    switch (fileType) {
        case 'image':
            return ImageIcon;
        case 'pdf':
            return PictureAsPdfIcon;
        case 'doc':
            return ArticleIcon;
        case 'video':
            return VideoCameraBackIcon;
        case 'folder':
            return FolderRounded;
        case 'trash':
            return DeleteIcon;
        default:
            return ArticleIcon;
    }
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,
        getLabelProps,
        getGroupTransitionProps,
        getDragAndDropOverlayProps,
        status,
        publicAPI,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    const item = publicAPI.getItem(itemId);
    const expandable = isExpandable(children);
    const icon = getIconFromFileType(item.fileType);

    return (
        <TreeItem2Provider itemId={itemId}>
            <StyledTreeItemRoot {...getRootProps(other)}>
                <CustomTreeItemContent
                    {...getContentProps({
                        className: clsx('content', {
                            'Mui-expanded': status.expanded,
                            'Mui-selected': status.selected,
                            'Mui-focused': status.focused,
                            'Mui-disabled': status.disabled,
                        }),
                    })}
                >
                    <TreeItem2IconContainer {...getIconContainerProps()}>
                        <TreeItem2Icon status={status} />
                    </TreeItem2IconContainer>
                    <TreeItem2Checkbox {...getCheckboxProps()} />
                    <CustomLabel
                        {...getLabelProps({ icon, expandable: expandable && status.expanded, fileType: item.fileType, publicAPI, itemId, link: item.link })}
                    />
                    <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
                </CustomTreeItemContent>
                {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
            </StyledTreeItemRoot>
        </TreeItem2Provider>
    );
});

export default function FileExplorer({ repoTree }) {
    // console.log("repoTree", repoTree)
    const apiRef = useTreeViewApiRef();

    return (
        <RichTreeView
            items={repoTree}
            apiRef={apiRef}
            // defaultExpandedItems={['1', '1.1']}
            sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            slots={{ item: CustomTreeItem }}
            experimentalFeatures={{ indentationAtItemLevel: true, itemsReordering: true }}
            itemsReordering
        // canMoveItemToNewPosition={(params) => {
        //     return (
        //         params.newPosition.parentId === null ||
        //         ['folder', 'trash'].includes(
        //             apiRef.current.getItem(params.newPosition.parentId).fileType,
        //         )
        //     );
        // }}
        />
    );
}