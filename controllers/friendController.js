const { Friend, User } = require('../models/index');

class FriendController {
    static async getFriends(req, res, next) {
        try {
            const { id: userId } = req.user;
            console.log(userId, '<<<<');
            const friends = await Friend.findAll({
                where: {
                    userId
                },
                include: [
                    { model: User, as: 'FriendUser', foreignKey: 'friendId', attributes: ['id','username'] }
                ]
            });
            res.json(friends);
        } catch (error) {
            next(error);
        }
    }

    static async deleteFriend(req, res, next) {
        try {
            // Pastikan pengguna terotentikasi
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { friendId } = req.params;
            const { userId } = req.user;

            const friend = await Friend.findOne({
                where: { userId, friendId }
            });

            if (!friend) {
                return res.status(404).json({ error: 'Friend not found' });
            }
            
            await friend.destroy();
            res.status(204).end(); 
        } catch (error) {
            next(error);
        }
    }
}

module.exports = FriendController;
