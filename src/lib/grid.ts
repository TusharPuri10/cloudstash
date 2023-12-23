const  calculateColumns = () => {
    const windowWidth = window.innerWidth;

    if (windowWidth >= 1200) {
        return 8; // Large screens, you can adjust this value
    }
    else if (windowWidth >= 1096) {
        return 7; // Medium screens, you can adjust this value
    }
    else if (windowWidth >= 992) {
        return 6; // Medium screens, you can adjust this value
    }
     else if (windowWidth >= 888) {
        return 5; // Medium screens, you can adjust this value
    } else if (windowWidth >= 784) {
        return 4; // Medium screens, you can adjust this value
    }
    else if (windowWidth >= 524) {
        return 3; // Medium screens, you can adjust this value
    }
    else {
        return 2; // Small screens, you can adjust this value
    }
};

export const calculatePosition = (index: number) => {
    const columns = calculateColumns();
    const x = (index % columns) * ((window.innerWidth-200) / columns);
    const y = Math.floor(index / columns) * (window.innerHeight / 5);
    return { x, y };
};