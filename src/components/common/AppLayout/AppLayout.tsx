

interface AppLayoutProps {
    header?: React.ReactNode
    sidebar?: React.ReactNode
    content?: React.ReactNode
}

export const AppLayout = ({ header, sidebar, content }: AppLayoutProps) => {
    return (
        <div className="w-full h-[100dvh] flex flex-col">
            {/* Header */}
            <div className="h-16 w-full">
                {header}
            </div>
            <div className="flex-1 bg-pink-500">

            </div>
            {header}
            {/* Sidebar */}
            {sidebar}
            {/* Content */}
            {content}
        </div>
    )
}