// - Validation des deux onglets du formulaire de profil -

export const validateInfos = ({ name, bio }: { name: string; bio: string }) => {
    const n = name.trim();
    const e: { name?: string; bio?: string } = {};
    if (n.length === 0) e.name = "Le nom d'utilisateur est requis.";
    else if (n.length < 2) e.name = "Le nom doit comporter au moins 2 caractères.";
    else if (n.length > 100) e.name = "100 caractères maximum.";
    if (bio.length > 300) e.bio = "La bio ne doit pas dépasser 300 caractères.";
    return e;
};

export const validateSecurity = ({
    current,
    newpw,
    confirm,
}: {
    current: string;
    newpw: string;
    confirm: string;
}) => {
    const e: { current?: string; newpw?: string; confirm?: string } = {};
    if (!current) e.current = "Saisissez votre mot de passe actuel.";
    if (newpw.length < 8) e.newpw = "8 caractères minimum.";
    if (confirm !== newpw) e.confirm = "Les mots de passe ne correspondent pas.";
    return e;
};
