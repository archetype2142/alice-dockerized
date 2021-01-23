require 'net/http'
require 'json'
require 'geom'

class FileParser
  attr_accessor :filename, :uri, :response_data, :file_data, :track_data, :last_unique_id

  def initialize(
      filename='../alice_container/events/event4047_run226466.json', 
      uri='http://127.0.0.1:3006/v2/structures/random'
    )
    @filename = filename
    @uri = uri
    fetch_data
    read_json_file
  end

  def fetch_data
    uri = URI(@uri)
    res = Net::HTTP.get_response(uri)

    # Headers
    res['Set-Cookie'] 
    res.get_fields('set-cookie')
    res.to_hash['set-cookie']

    json_data = JSON.parse res.body
    @response_data = json_data
  end

  def read_json_file
    # open and read file
    file = File.open(
      File.join(
        File.dirname(__FILE__), 
        @filename
      )
    )

    # parse to json 
    json_data = JSON.parse file.read
    tracks = json_data["fTracks"]
    @file_data = json_data
    @track_data = tracks
    @last_unique_id = @track_data[-1]["fUniqueID"]
    file.close
  end

  def track_builder
    track = {
      fUniqueID: @last_unique_id += 1,
      fBits: 33554432,
      fType: "standard",
      fCharge: rand(-1..1),
      fStartCoordinates: [0, 0, 0],
    }.merge(
      polygons(
        @response_data["curvature"],
        @response_data["angle"],
      )
    )
    @last_unique_id += 1
    track
  end

  def polygons curvature, fTheta
    a = fTheta
    r = curvature

    t_int = (0..20).step(0.1).to_a
    values = t_int.map do |t|
      {
        x: (r * Math.cos(t)),
        y: (r * Math.sin(t)),
        z: (a * t)
      }
    end

    # values = t_int.map do |t|
    #   {
    #     x: (r * Math.cos(t)),
    #     y: (r * Math.sin(t)),
    #     z: (r * t * Math.tan(5))
    #   }
    # end

    puts "Curvature: #{curvature}"
    puts "Angle: #{fTheta}"

    {
      fPolyX: values.map{|v| v[:x]},
      fPolyY: values.map{|v| v[:y]},
      fPolyZ: values.map{|v| v[:z]},
      fHelixCurvature: @response_data["curvature"],
      fTheta: @response_data["angle"]
    }
  end

  def append_to_array
    @track_data = @track_data.push(track_builder)
  end

  def write_to_file
    append_to_array
    file = File.open(filename, "w")
    write_string =  {
      _typename: @file_data["_typename"],
      fUniqueID: @file_data["fUniqueID"],
      fBits: @file_data["fBits"],
      fEventID: @file_data["fEventID"],
      fEnergy: @file_data["fEnergy"],
      fMultiplicity: @file_data["fMultiplicity"],
      fCollidingSystem: @file_data["fCollidingSystem"],
      fTimeStamp: @file_data["fTimeStamp"],
      fTracks: @track_data,
      fClusters: @file_data["fClusters"]
    }
    file.puts JSON.pretty_generate(write_string)
    file.close
  end
end

(1..20).to_a.each do |x|
  file_parser = FileParser.new
  file_parser.write_to_file
end


# where 𝑟 is the radius of the "tube" and 𝑅 is the winding radius. In your particular picture you will have 𝑎>>1 and 𝑟,𝑅=𝑜(1).

