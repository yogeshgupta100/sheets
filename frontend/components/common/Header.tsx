import Image from 'next/image';
import SearchBar from '../common/SearchBar';
import SideNavbar from './SideNavbar';

export default function Header() {
    return (
        <header className="flex justify-between items-center py-4 px-8 bg-white">
            <SideNavbar />
            <div className="flex items-center">
                <Image src="/images/image1.png" alt="Sheets Icon" width={26} height={26} />
                <span className="text-lg font-semibold ml-2 text-black">Sheets</span>
            </div>
            <div className="flex-grow mx-4">
                <SearchBar />
            </div>
            <div>
                <Image src="/images/image2.png" alt="Profile Icon" width={32} height={32} className="rounded-full" />
            </div>
        </header>
    );
}
