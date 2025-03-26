type __VLS_Props = {
    name?: string;
    selected?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    room_selected: (...args: any[]) => void;
    remove: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRoom_selected?: ((...args: any[]) => any) | undefined;
    onRemove?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
