export type CMSPageData = {
    title?: string;
    images?: Array<ImageBlockData>;
    textBlocks?: Array<TextBlockData>;
    textBlockLists?: Array<TextBlockListData>;
    imageBlockLists?: Array<ImageBlockListData>;
};

export type ImageBlockData = {
    id?: string;
    imageUrl?: string;
    altText?: string;
    description?: (string) | null;
};

export type TextBlockData = {
    id?: string;
    content?: string;
};

export type ImageBlockListData = {
    id?: string;
    name?: string;
    imageBlocks?: Array<ImageBlockData>;
};

export type TextBlockListData = {
    id?: string;
    name?: string;
    textBlocks?: Array<TextBlockData>;
};