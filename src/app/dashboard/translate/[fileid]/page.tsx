import PdfRenderer from '@/components/PdfRenderer';
import { db } from '@/db';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
    params: {
        fileid: string;
    };
}

const TranslatePage = async ({ params }: PageProps) => {
    const { fileid } = await Promise.resolve(params);

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        redirect(`/auth-callback?origin=dashboard/${fileid}`);
    }

    const file = await db.file.findFirst({
        where: {
            id: fileid,
            userId: user.id,
        },
    });

    if (!file) notFound();

    const plan = await getUserSubscriptionPlan();


    return (
        <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-6 sm:px-6 lg:pl-8 xl:px-6">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Translate PDF
                    </h1>
                    <h2 className="text-lg font-semibold mb-3">Outils de Traduction</h2>
                    <textarea
                        className="w-full h-48 border rounded-lg p-2 mb-4"
                        placeholder="Entrez votre traduction ici..."
                    ></textarea>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                        Traduire
                    </button>
                </div>
            </div>
            <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
                {/* Section PDF Viewer */}
                <div className="flex-1 xl:flex">
                    <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                        {/* Render PDF */}
                        <PdfRenderer url={file.url}/>
                    </div>
                </div>

                {/* Section Translation PDF Viewer */}
                <div className="shrink-0  flex-1 border-t border-gray-200 lg:border-l lg:border-t-0">
                    <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                        {/* Translation PDF */}
                        <PdfRenderer url={file.url} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslatePage;
