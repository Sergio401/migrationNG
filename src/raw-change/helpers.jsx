export function modifyJsonObject(jsonObj) {
    
    // Validar si la propiedad 'name' es igual a 'equipmentProperty'
    if (jsonObj.name === 'equipmentProperty') {
      
      // Eliminar la propiedad 'propertyOptions' si existe
      if (jsonObj.hasOwnProperty('propertiesOption')) {
        delete jsonObj.propertiesOption;
      }
  
      // Validar si tiene las propiedades 'height', 'selectedPropertyId', 'InputForEquipmentId'
      // Si no las tiene, agregarlas con valores por defecto
      if (!jsonObj.hasOwnProperty('height')) {
        jsonObj.height = 15; // Valor por defecto
      }
  
      if (!jsonObj.hasOwnProperty('selectedPropertyId')) {
        jsonObj.selectedPropertyId = null; // Valor por defecto
      }
  
      if (!jsonObj.hasOwnProperty('InputForEquipmentId')) {
        jsonObj.InputForEquipmentId = null; // Valor por defecto
      }
    }
  
    // Devolver el objeto JSON modificado
    return jsonObj;
  }
  
  