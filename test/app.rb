require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'jbundle'

before do
  JBundle.config_from_file File.dirname(__FILE__) + '/../Jfile'
end

get '/bundle.js' do
  content_type 'application/x-javascript'
  JBundle.build('sockete.js').src
end