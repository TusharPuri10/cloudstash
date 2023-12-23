const  calculateColumns = () => {
    const windowWidth = window.innerWidth;

    if (windowWidth >= 1200) {
        return 8; // Large screens, you can adjust this value
    } else if (windowWidth >= 768) {
        return 4; // Medium screens, you can adjust this value
    } else {
        return 2; // Small screens, you can adjust this value
    }
};

export const calculatePosition = (index: number) => {
    const columns = calculateColumns();
    const x = (index % columns) * ((window.innerWidth-100) / columns);
    const y = Math.floor(index / columns) * (window.innerHeight / columns);
    return { x, y };
};