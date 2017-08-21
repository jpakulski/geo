class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  require 'csv'
  RESULT_CSV_FILE_NAME = 'geocoded.csv'

  def index
  end

  def geocode
    file_content = params.require(:file).read
    csv_content = CSV.parse(file_content, headers: true)

    if csv_content.headers.include?('Address') && csv_content.headers.include?('Latitude') && csv_content.headers.include?('Longitude')
      @@total_records = csv_content.length
      @@number_processed = 0
      result_file_path = File.join(Rails.root, 'public', RESULT_CSV_FILE_NAME)
      result_file = CSV.open(result_file_path, 'wb')
      logger.debug "Opened the result file: #{result_file_path}"
      result_file << csv_content.headers

      csv_content.each do |row|
        unless row['Address'].empty?
          geo_data = Geocoder.search(row['Address'])
          if geo_data && geo_data.count > 0
            geo_data = geo_data.first
            row['Latitude'] = geo_data.geometry['location']['lat']
            row['Longitude'] = geo_data.geometry['location']['lng']
            logger.debug "Output to file: : #{row}"
            result_file << row
          end
        end
        @@number_processed += 1
      end
      result_file.flush()
      logger.debug 'Flushed output file'
      result_file.close()
      logger.debug 'Closed output file'
      render json: { file: RESULT_CSV_FILE_NAME }
    else
      render json: { message: 'The uploaded file did not contain the Address, Lattitude or Longitude headers!' }, status: 422
    end
  rescue Exception
    render json: { message: 'Something unexpected happened. Try again in a few minutes. Perhaps check your file over while aiting?' }, status: 500
  end

  def geocode_result
    send_file File.join(Rails.root, 'public', RESULT_CSV_FILE_NAME), type: 'text/csv', x_sendfile: true
  end

  def geocode_update
    render json: { records_processed: @@number_processed || 0, total_records: @@total_records || 0 }
  end

  private

  def google_geocode(address)

  end
end
