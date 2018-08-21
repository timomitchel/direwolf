class Direwolf

  attr_reader :name, :home, :size, :starks_to_protect, :stark_count

  def initialize(name, home = "Beyond the Wall", size = "Massive")
    @name = name
    @home = home
    @size = size
    @starks_to_protect = []
    @stark_count = 0
  end

  def protects(stark)
    starks_to_protect << stark if self.home == stark.location && stark_count < 2
    @stark_count += 1
    stark.safe = true
  end



  def hunts_white_walkers?
    true unless stark_count > 0
  end

  def leaves(stark)
    if starks_to_protect.include?(stark)
      starks_to_protect.delete_if do |kid|
        kid == stark
      end
      stark.safe = false
    else
    stark
    end
  end


end

class Stark

  attr_reader :name, :location
  attr_accessor :safe

  def initialize(name, location = "Winterfell")
    @name = name
    @location = location
    @safe = false
  end

  def safe?
    @safe
  end

  def house_words
    if safe?
      'The North Remembers'
    else
      'Winter is Coming'
    end
  end


end
