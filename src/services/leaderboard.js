import supabase from '@/services/supabase'

export const getLeaderboard = async () => {
  try {
    // Выполняем запрос к таблице users, сортируем по score по убыванию
    const { data, error } = await supabase
      .from('users')
      .select('score, telegram') // Выбираем нужные поля
      .order('score', { ascending: false }); // Сортируем по score (по убыванию)

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};
