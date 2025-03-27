import { X } from "lucide-react";

export default function EditorMenu({
    closeEditor,
}: {
    closeEditor: () => void;
}) {
    return (
        <div className="bg-popover absolute top-1/2 left-1/2 z-50 mx-auto w-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-xl p-6 text-white">
            <div className="mb-7 flex items-start justify-between">
                <div>
                    <h3 className="font-titleFont text-popover-foreground text-lg font-medium">
                        Éditer votre profil
                    </h3>
                    <p className="font-bodyFont text-popover-foreground">
                        Rentrez vos informations et sauvegardez les.
                    </p>
                </div>
                <X
                    className="text-popover-foreground cursor-pointer"
                    onClick={closeEditor}
                />
            </div>
            <form className="flex flex-col gap-7">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="url"
                        className="font-bodyFont text-popover-foreground text-sm font-semibold"
                    >
                        URL du profil{" "}
                        <span className="text-accent-foreground text-xs">
                            (library-app.fr/userProfil/[ici])
                        </span>
                    </label>
                    <input
                        type="text"
                        name="urlProfil"
                        id="url"
                        placeholder="Nom d'utilisateur"
                        className="bg-input font-bodyFont text-accent-foreground placeholder:text-accent-foreground focus-visible:ring-ring rounded py-2 pl-3 text-xs focus-visible:ring-1 focus-visible:outline-none"
                    />
                </div>
                <div className="flex justify-between gap-10">
                    <div className="flex w-1/2 flex-col gap-2">
                        <label
                            htmlFor="github"
                            className="font-bodyFont text-popover-foreground text-sm font-semibold"
                        >
                            Github
                        </label>
                        <input
                            type="text"
                            name="githubProfil"
                            id="github"
                            placeholder="Profil Github"
                            className="bg-input font-bodyFont text-accent-foreground placeholder:text-accent-foreground focus-visible:ring-ring rounded py-2 pl-3 text-xs focus-visible:ring-1 focus-visible:outline-none"
                        />
                    </div>
                    <div className="flex w-1/2 flex-col gap-2">
                        <label
                            htmlFor="linkedin"
                            className="font-bodyFont text-popover-foreground text-sm font-semibold"
                        >
                            LinkedIn
                        </label>
                        <input
                            type="text"
                            name="linkedinProfil"
                            id="linkedin"
                            placeholder="Profil LinkedIn"
                            className="bg-input font-bodyFont text-accent-foreground placeholder:text-accent-foreground focus-visible:ring-ring rounded py-2 pl-3 text-xs focus-visible:ring-1 focus-visible:outline-none"
                        />
                    </div>
                </div>
                <div className="flex justify-between gap-10">
                    <div className="flex w-1/2 flex-col gap-2">
                        <label
                            htmlFor="twitter"
                            className="font-bodyFont text-popover-foreground text-sm font-semibold"
                        >
                            Twitter (sans @)
                        </label>
                        <input
                            type="text"
                            name="twitterProfil"
                            id="twitter"
                            placeholder="Profil Twitter"
                            className="bg-input font-bodyFont text-accent-foreground placeholder:text-accent-foreground focus-visible:ring-ring rounded py-2 pl-3 text-xs focus-visible:ring-1 focus-visible:outline-none"
                        />
                    </div>
                    <div className="flex w-1/2 flex-col gap-2">
                        <label
                            htmlFor="instagram"
                            className="font-bodyFont text-popover-foreground text-sm font-semibold"
                        >
                            Instagram (sans @)
                        </label>
                        <input
                            type="text"
                            name="instagramProfil"
                            id="instagram"
                            placeholder="Profil Instagram"
                            className="bg-input font-bodyFont text-accent-foreground placeholder:text-accent-foreground focus-visible:ring-ring rounded py-2 pl-3 text-xs focus-visible:ring-1 focus-visible:outline-none"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="description"
                        className="font-bodyFont text-popover-foreground text-sm font-semibold"
                    >
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        maxLength={150}
                        placeholder="Dites en plus sur vous..."
                        className="bg-input font-bodyFont placeholder:text-accent-foreground focus-visible:ring-ring h-14 w-full resize-none rounded py-2 pl-3 text-xs focus-visible:ring-1 focus-visible:outline-none"
                    ></textarea>
                </div>
                <button className="bg-primary font-bodyFont text-primary-foreground my-0 mr-0 ml-auto max-w-24 rounded px-4 py-1.5 text-xs font-bold">
                    Enregistrer
                </button>
            </form>
        </div>
    );
}
