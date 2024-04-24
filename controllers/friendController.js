const { Friend, User } = require('../models');

class FriendController {

    static async getFriends(req, res, next) {
        try {
            const { userId } = req.user; 
            const friends = await Friend.findAll({
                where: { userId },
                include: [
                    { model: User, as: 'Friend' }
                ]
            });
            res.json(friends);
        } catch (error) {
            next(error);
        }
    }


    static async deleteFriend(req, res, next) {
        try {
            const { friendId } = req.params;
            const { userId } = req.user; 

        
            const friend = await Friend.findOne({
                where: { userId, friendId }
            });

            if (!friend) {
                return res.status(404).json({ error: 'Friend not found' });
            }

            // Hapus teman
            await friend.destroy();
            res.status(204).end(); // Tidak ada konten yang dikembalikan setelah berhasil dihapus
        } catch (error) {
            next(error);
        }
    }
}

module.exports = FriendController;
