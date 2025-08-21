import React from "react";
import axios from "axios";
import { CMSPageData, ImageBlockData, ImageBlockListData, TextBlockData, TextBlockListData } from "./types/CMSTypes"
import { createContext, useContext, useState, useRef, useCallback } from "react";
import { CMSConfiguration } from "./Configuration";

type CMSContextType = {
    pageData?: CMSPageData | null;
    isLoading: boolean;
    error: string | null;
    loadPageData: (pageId: string) => Promise<void>;
    getTextBlock: (textBlockId: string) => TextBlockData | null;
    getImageBlock: (imageBlockId: string) => ImageBlockData | null;
    getTextContent: (textBlockId: string) => string | null;
    getImageUrl: (imageBlockId: string) => string | null;
    getImageBlockList: (imageBlockListId: string) => ImageBlockListData | null;
    getTextBlockList: (textBlockListId: string) => TextBlockListData | null;
    cleanUp: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined)

export const useCMS = (): CMSContextType => {
    const context = useContext(CMSContext);
    if (!context) {
        throw new Error("useCMS must be used within a CMSProvider");
    }
    return context;
};

export function CMSProvider({ children, config = new CMSConfiguration("https://api.myheadless.io/cms") }: { children: React.ReactNode, config?: CMSConfiguration }) {
    const [pageData, setPageData] = useState<CMSPageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPageId, setCurrentPageId] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const loadPageData = useCallback(async (pageId: string) => {
        if (currentPageId === pageId && isLoading) {
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setIsLoading(true);
        setError(null);
        setCurrentPageId(pageId);

        try {
            const response = await axios.get(
                `${config.baseURL}/${pageId}`,
                { 
                    signal: abortController.signal,
                    headers: config.apiKey ? { 'X-API-Key': config.apiKey } : {}
                }
            );
            
            if (!abortController.signal.aborted && currentPageId === pageId) {
                setPageData(response.data);
            }
        } catch (err) {
            if (!abortController.signal.aborted) {
                setError(err instanceof Error ? err.message : 'Error loading page data');
                setPageData(null);
            }
        } finally {
            if (!abortController.signal.aborted) {
                setIsLoading(false);
            }
        }
    }, [currentPageId, isLoading, config]);

    const getTextBlock = (textBlockId: string) => {
        return pageData?.textBlocks?.find(block => block.id === textBlockId) || null;
    };

    const getImageBlock = (imageBlockId: string) => {
        return pageData?.images?.find(block => block.id === imageBlockId) || null;
    };

    const getTextContent = (textBlockId: string): string | null => {
        const textBlock = getTextBlock(textBlockId);
        return typeof textBlock?.content === "string" ? textBlock.content : null;
    }

    const getImageUrl = (imageBlockId: string): string | null => {
        const imageBlock = getImageBlock(imageBlockId);
        return typeof imageBlock?.imageUrl === "string" ? imageBlock.imageUrl : null;
    }

    const getImageBlockList = (imageBlockListId: string): ImageBlockListData | null => {
        return pageData?.imageBlockLists?.find(list => list.id === imageBlockListId) || null;
    }

    const getTextBlockList = (textBlockListId: string): TextBlockListData | null => {
        return pageData?.textBlockLists?.find(list => list.id === textBlockListId) || null;
    }

    const cleanUp = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        
        setPageData(null);
        setCurrentPageId(null);
        setIsLoading(false);
        setError(null);
    }, []);

    const value = {
        pageData,
        isLoading,
        error,
        loadPageData,
        getTextBlock,
        getImageBlock,
        getTextContent,
        getImageUrl,
        cleanUp,
        getImageBlockList,
        getTextBlockList
    };

    return (
        <CMSContext.Provider value={value}>
            {children}
        </CMSContext.Provider>
    );
}