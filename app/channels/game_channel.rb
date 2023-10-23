class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_#{params[:game_id]}"
  end

  def move(data)

    p data

    ActionCable.server.broadcast("game_#{params[:game_id]}", { action: 'move', player: data['player'] })
  end
end
