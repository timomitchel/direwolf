

def sits_on_throne(arya, cersei)
  result = {arya => cersei}
  arya.kill(cersei)
  puts "Are you alive Cersei? #{result[arya]}"
end

def kill(character)
  character = nil
end