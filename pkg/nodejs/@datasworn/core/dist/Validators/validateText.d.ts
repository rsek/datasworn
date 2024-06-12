export declare function validateIdsInStrings(data: unknown, validIds: Map<string, unknown> | Set<string>): boolean;
export declare function validateMacroIdPointers(text: string, validIds: Map<string, unknown> | Set<string>): boolean;
export declare function validateMarkdownIdPointers(text: string, validIds: Map<string, unknown> | Set<string>): boolean;
export declare function validateIdPointer(dataswornId: string, idTracker: Set<string> | Map<string, unknown>): boolean;
/** Recursively iterates over JSON values, applying a function to every primitive boolean, number, string, and null value. */
export declare function forEachPrimitiveValue<T = unknown>(value: T, key: string | number | undefined, fn: (v: boolean | number | string | null, k: unknown) => void): void;
