
// Thêm đoạn mã sau vào file custom.d.ts để khai báo (chat bot) kiểu cho thẻ <df-messenger> trong file HomePage
declare namespace JSX {
    interface IntrinsicElements {
        'df-messenger': any;
    }
}