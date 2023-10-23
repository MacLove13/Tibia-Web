module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_player

    def connect
      self.current_player = find_verified_player
    end

    private

    def find_verified_player
      # Implemente a lógica de verificação do jogador aqui
    end
  end
end
