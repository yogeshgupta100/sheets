import Image from 'next/image';

export default function SearchBar() {
    return (
        <div className="flex items-center bg-blue-100 rounded-full p-2 w-full max-w-md">
            <div className="flex-shrink-0">
                <Image src="/images/image3.png" alt="Search Icon" width={25} height={25} className="rounded-full" />
            </div>
            <input
                type="text"
                placeholder="Search"
                className="ml-3 bg-blue-100 focus:outline-none w-full font-special text-xl text-blue-900"
            />
        </div>
    );
}
