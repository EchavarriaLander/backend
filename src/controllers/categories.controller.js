export const getHomeCategories = async (req, res) => {
    try {
        const categories = [
            {
                title: "Continue Watching",
                movies: await getContinueWatching(req.profile.id)
            },
            {
                title: "Popular on Netflix",
                movies: await getPopularMovies()
            },
            {
                title: "Because you watched X",
                movies: await getRelatedMovies(req.profile.id)
            },
            {
                title: "New Releases",
                movies: await getNewReleases()
            }
        ]
        
        res.json(categories)
    } catch (error) {
        res.status(500).json({ message: 'Error getting categories' })
    }
} 