def sits_on_throne(arya, cersei)
  if arya > cersei
    result = {arya => cersei}
  else
    result = {cersei => arya}    
  end
  arya.kill(cersei)
  puts "Are you alive Cersei? #{result[arya]}"
end

def kill(character)
  character = nil
end