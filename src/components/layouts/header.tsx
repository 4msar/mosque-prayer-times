export const Header = () => {
    return (
        <header className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                <img src="/icons/icon-512x512.png" alt="logo" className="h-8 w-8" />
            </div>
            <div className="h-8 flex flex-col items-start justify-center gap-0.5">
                <h1 className="text-lg font-semibold text-gray-900 leading-4 mt-2">
                    <span className="hidden md:block">Mosque Prayer Times</span>
                    <span className="block md:hidden">MPT</span>
                </h1>
                <p className="hidden text-sm text-gray-500 md:block">Find nearby mosques and their prayer times</p>
                <p className="block text-sm text-gray-500 md:hidden">Mosque prayer times</p>
            </div>
        </header>
    );
};