package com.baryonyx.client.ClientJava.requests.get;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.client.fluent.Request;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class GetRequest {

	private final static String BASE_URL = "http://192.168.99.100:8440";

	public static void main(String[] args) throws IOException, InterruptedException, ParseException {
		String clientID = "66GG";
		sendGET(clientID);
	}

	public static void sendGET(String userID) throws IOException, InterruptedException, ParseException {
		HttpResponse response = Request.Get(BASE_URL + "/symmetry/allergy/" + userID).execute().returnResponse();
		System.out.println(response.getStatusLine().getStatusCode());
		String body = EntityUtils.toString(response.getEntity(), "UTF-8");
		//System.out.println(body);

		JSONParser parser = new JSONParser();
		JSONArray json = null;
		json = (JSONArray) parser.parse(body);
		for (int i = 0; i < json.size(); i++) {
			String id, propietarioID, nombre, descripcion;

			JSONObject alergia = (JSONObject) parser.parse(json.get(i).toString());

			// Extraemos los valores del JSON en forma de URI
			id = (String) ((JSONObject) alergia.get("?id")).get("value");
			propietarioID = (String) ((JSONObject) alergia.get("?propietario")).get("value");
			nombre = (String) ((JSONObject) alergia.get("?nombre")).get("value");
			descripcion = (String) ((JSONObject) alergia.get("?descripcion")).get("value");

			System.out.println(id);
			System.out.println(propietarioID);
			System.out.println(nombre);
			System.out.println(descripcion);
			// Creamos la alergia con estos datos y la metemos en un listado; la devolvemos
		}
	}

}
