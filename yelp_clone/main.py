# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
# [START gae_python3_app]
from wsgiref import headers
from flask import Flask
from flask import request
import requests

api_key = 'nqFkfT0v5ny8f6P705ahQTjTbRnlMSAJrQTI_dhbEHDf7C6CP0g-9I4TOdkddP9-HPlQqp4uNNbCgjz-J1Ti7wtgPXN701k5ltflqNTjaCRZ61kN9qCJrogTx4U3Y3Yx'


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)

header = {'Authorization':'Bearer {}'.format(api_key)}


@app.route('/')
def homepage():
    return app.send_static_file('index.html')


@app.route('/testing',methods=['GET'])
def callingyelpapi():
    keyword = request.args.get('keyword')
    distancemeters = int(float(request.args.get('distancemeters')))
    category = request.args.get('categories')
    lat = request.args.get('lat')
    long = request.args.get('lng')
    url = 'https://api.yelp.com/v3/businesses/search?term={}&latitude={}&longitude={}&categories={}&radius={}'.format(keyword,lat,long,category,distancemeters)
    print(url)
    res = requests.get(url,headers=header).json()
    return (res)


@app.route('/businfo',methods=['GET'])
def callingyelpapibus():
    id = request.args.get('id')
    url = 'https://api.yelp.com/v3/businesses/{}'.format(id)
    res = requests.get(url,headers=header).json()
    return (res)
    


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]