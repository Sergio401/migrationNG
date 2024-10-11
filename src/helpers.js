export const convertToUpdatedObj = (obj) => {
  if (obj === null || typeof obj === 'undefined') {
    return null; // or undefined based on your requirement
  }

  if (typeof obj === 'string') {
    return { result: obj.toLowerCase() };
  }

  if (Array.isArray(obj)) {
    const logicOperator = obj[0].toLowerCase();
    const updatedData = obj
      .slice(1)
      .map(convertToUpdatedObj)
      .filter((e) => e !== null);
    if (!updatedData.length) {
      return null;
    }
    if (updatedData.length === 1) {
      return updatedData[0];
    }
    return { [logicOperator]: updatedData };
  }

  const result = {};
  const {
    name = '',
    operator = '',
    value = '',
    valueId = '',
    type = '',
    relatedManagedObjectId,
    selectedPropertyId = '',
    managedObject,
    selectedPropertyAliasId,
  } = obj;
  if (name !== '' || operator !== '' || value !== '' || valueId !== '') {
    switch (name) {
      case 'name':
        switch (operator) {
          case 'contains':
            result['nameContainsFold'] = value;
            break;
          case 'eq':
            result[valueId ? 'id' : 'name'] = Number(valueId) || value;
            break;
          case 'regexp':
            result['nameRegex'] = value;
            break;
          case 'notContains':
            result['not'] = {
              nameContains: value,
            };
            break;
        }
        break;
      case 'lifecycleStatus':
        switch (operator) {
          case 'contains':
            result['lifecyclestatus'] = value.toUpperCase();
            break;
          case 'eq':
            result['lifecyclestatus'] = value.toUpperCase();
            break;
          default:
            result['lifecyclestatusNotIn'] = [value.toUpperCase()];
            break;
        }
        break;
      case 'externalId':
        switch (operator) {
          case 'contains':
            result['externalIDContainsFold'] = value;
            break;
          case 'eq':
            result['externalID'] = value;
            break;
          case 'regexp':
            result['externalIDRegex'] = value;
            break;
          case 'notContains':
            result['not'] = {
              externalIDContains: value,
            };
            break;
          default:
            result['externalIDNotIn'] = [value];
            break;
        }
        break;
      case 'equipmentType':
        switch (operator) {
          case 'contains':
            result['hasTypeWith'] = [
              {
                nameContainsFold: value,
                hasManagedObjectWith: managedObject?.option?.key
                  ? [
                      {
                        id: Number(managedObject?.option?.key),
                      },
                    ]
                  : null,
              },
            ];
            break;
          case 'eq':
            result['hasTypeWith'] = [
              {
                [valueId ? 'id' : 'name']: Number(valueId) || value,
                ...(!valueId && managedObject?.option?.key
                  ? {
                      hasManagedObjectWith: [
                        {
                          id: Number(managedObject.option.key),
                        },
                      ],
                    }
                  : {}),
              },
            ];
            break;
          case 'regexp':
            result['hasTypeWith'] = [
              {
                nameRegex: value,
                hasManagedObjectWith: managedObject?.option?.key
                  ? [
                      {
                        id: Number(managedObject?.option?.key),
                      },
                    ]
                  : null,
              },
            ];
            break;
          case 'notContains':
            result['hasTypeWith'] = [
              {
                not: {
                  nameContainsFold: value,
                },
                hasManagedObjectWith: managedObject?.option?.key
                  ? [
                      {
                        id: Number(managedObject?.option?.key),
                      },
                    ]
                  : null,
              },
            ];
            break;
        }
        break;
      case 'managedObjects':
        switch (operator) {
          case 'eq':
            result['hasTypeWith'] = [
              {
                hasManagedObjectWith: [
                  managedObject?.option?.key
                    ? {
                        id: Number(managedObject?.option?.key),
                      }
                    : {
                        name: managedObject?.option?.label,
                      },
                ],
              },
            ];
            break;
        }
        break;
      case 'equipmentProperty':
        switch (type) {
          case 'bool':
            result['and'] = [
              {
                hasPropertiesWith: [
                  {
                    boolVal: JSON.parse(value),
                    hasTypeWith: [
                      {
                        id: Number(selectedPropertyId),
                      },
                    ],
                  },
                ],
              },
            ];
            break;
          case 'string':
            const selectedOperator =
              operator === 'eq'
                ? 'stringVal'
                : operator === 'regexp'
                ? 'stringValRegex'
                : 'stringValContainsFold';
            result['and'] = [
              {
                hasPropertiesWith: [
                  {
                    [selectedOperator]: value,
                    hasTypeWith: [
                      {
                        id: Number(selectedPropertyId),
                      },
                    ],
                  },
                ],
              },
            ];
            break;
          case 'int':
            result['and'] = [
              {
                hasPropertiesWith: [
                  {
                    intVal: value && JSON.parse(value),
                    hasTypeWith: [
                      {
                        id: Number(selectedPropertyId),
                      },
                    ],
                  },
                ],
              },
            ];
            break;
          case 'float':
            result['and'] = [
              {
                hasPropertiesWith: [
                  {
                    floatVal: value && JSON.parse(value),
                    hasTypeWith: [
                      {
                        id: Number(selectedPropertyId),
                      },
                    ],
                  },
                ],
              },
            ];
            break;
        }
        break;
      case 'parentName':
        switch (operator) {
          case 'contains':
            result['hasParentPositionWith'] = [
              {
                hasParentWith: [
                  {
                    nameContainsFold: value,
                  },
                ],
              },
            ];
            break;
          case 'eq':
            result['hasParentPositionWith'] = [
              {
                hasParentWith: [
                  { [valueId ? 'id' : 'name']: Number(valueId) || value },
                ],
              },
            ];
            break;
          case 'regexp':
            result['hasParentPositionWith'] = [
              {
                hasParentWith: [{ nameRegex: value }],
              },
            ];
            break;
        }
        break;
      case 'propertyAlias':
        switch (type) {
          case 'bool':
            result['hasTypeWith'] = [
              {
                hasManagedObjectWith: [
                  {
                    id:
                      obj?.name === 'propertyAlias'
                        ? Number(managedObject?.option?.key)
                        : Number(relatedManagedObjectId),
                    hasPropertyAliasWith: [
                      {
                        id: Number(selectedPropertyAliasId),
                      },
                    ],
                  },
                ],
              },
            ];
            result['hasPropertiesWith'] = [
              {
                boolVal: JSON.parse(value),
              },
            ];
            break;
          case 'string':
            const selectedOperator =
              operator === 'eq'
                ? 'stringVal'
                : operator === 'regexp'
                ? 'stringValRegex'
                : 'stringValContainsFold';
            result['hasTypeWith'] = [
              {
                hasManagedObjectWith: [
                  {
                    id:
                      obj?.name === 'propertyAlias'
                        ? Number(managedObject?.option?.key)
                        : Number(relatedManagedObjectId),
                    hasPropertyAliasWith: [
                      {
                        id: Number(selectedPropertyAliasId),
                      },
                    ],
                  },
                ],
              },
            ];
            result['hasPropertiesWith'] = [
              {
                [selectedOperator]: value,
              },
            ];
            break;
          case 'int':
            result['hasTypeWith'] = [
              {
                hasManagedObjectWith: [
                  {
                    id:
                      obj?.name === 'propertyAlias'
                        ? Number(managedObject?.option?.key)
                        : Number(relatedManagedObjectId),
                    hasPropertyAliasWith: [
                      {
                        id: Number(selectedPropertyAliasId),
                      },
                    ],
                  },
                ],
              },
            ];
            result['hasPropertiesWith'] = [
              {
                intVal: value && JSON.parse(value),
              },
            ];
            break;
          case 'float':
            result['hasTypeWith'] = [
              {
                hasManagedObjectWith: [
                  {
                    id:
                      obj?.name === 'propertyAlias'
                        ? Number(managedObject?.option?.key)
                        : Number(relatedManagedObjectId),
                    hasPropertyAliasWith: [
                      {
                        id: Number(selectedPropertyAliasId),
                      },
                    ],
                  },
                ],
              },
            ];
            result['hasPropertiesWith'] = [
              {
                floatVal: value && JSON.parse(value),
              },
            ];
            break;
        }
        break;
      case 'relatedManagedObject':
        switch (type) {
          case 'bool':
            result['hasTypeWith'] = [
              {
                hasManagedObjectWith: [
                  {
                    id: Number(managedObject?.option?.key),
                  },
                ],
              },
            ];
            result['hasParentPositionWith'] = [
              {
                hasParentWith: [
                  {
                    hasTypeWith: [
                      {
                        hasManagedObjectWith: [
                          {
                            id: Number(relatedManagedObjectId),
                          },
                        ],
                      },
                    ],
                    hasPropertiesWith: [
                      {
                        hasTypeWith: [
                          {
                            hasPropertyTypeAliasWith: [
                              {
                                id: Number(selectedPropertyAliasId),
                              },
                            ],
                          },
                        ],
                      },
                      {
                        boolVal: JSON.parse(value),
                      },
                    ],
                  },
                ],
              },
            ];
            break;
          case 'string':
            const selectedOperator =
              operator === 'eq'
                ? 'stringVal'
                : operator === 'regexp'
                ? 'stringValRegex'
                : 'stringValContainsFold';
            result['hasTypeWith'] = [
              {
                hasManagedObjectWith: [
                  {
                    id: Number(managedObject?.option?.key),
                  },
                ],
              },
            ];
            result['hasParentPositionWith'] = [
              {
                hasParentWith: [
                  {
                    hasTypeWith: [
                      {
                        hasManagedObjectWith: [
                          {
                            id: Number(relatedManagedObjectId),
                          },
                        ],
                      },
                    ],
                    hasPropertiesWith: [
                      {
                        hasTypeWith: [
                          {
                            hasPropertyTypeAliasWith: [
                              {
                                id: Number(selectedPropertyAliasId),
                              },
                            ],
                          },
                        ],
                      },
                      {
                        [selectedOperator]: value,
                      },
                    ],
                  },
                ],
              },
            ];
            break;
          case 'int':
            result['hasTypeWith'] = [
              {
                hasManagedObjectWith: [
                  {
                    id: Number(managedObject?.option?.key),
                  },
                ],
              },
            ];
            result['hasParentPositionWith'] = [
              {
                hasParentWith: [
                  {
                    hasTypeWith: [
                      {
                        hasManagedObjectWith: [
                          {
                            id: Number(relatedManagedObjectId),
                          },
                        ],
                      },
                    ],
                    hasPropertiesWith: [
                      {
                        hasTypeWith: [
                          {
                            hasPropertyTypeAliasWith: [
                              {
                                id: Number(selectedPropertyAliasId),
                              },
                            ],
                          },
                        ],
                      },
                      {
                        intVal: value && JSON.parse(value),
                      },
                    ],
                  },
                ],
              },
            ];
            break;
          case 'float':
            result['hasTypeWith'] = [
              {
                hasManagedObjectWith: [
                  {
                    id: Number(managedObject?.option?.key),
                  },
                ],
              },
            ];
            result['hasParentPositionWith'] = [
              {
                hasParentWith: [
                  {
                    hasTypeWith: [
                      {
                        hasManagedObjectWith: [
                          {
                            id: Number(relatedManagedObjectId),
                          },
                        ],
                      },
                    ],
                    hasPropertiesWith: [
                      {
                        hasTypeWith: [
                          {
                            hasPropertyTypeAliasWith: [
                              {
                                id: Number(selectedPropertyAliasId),
                              },
                            ],
                          },
                        ],
                      },
                      {
                        floatVal: value && JSON.parse(value),
                      },
                    ],
                  },
                ],
              },
            ];
            break;
        }
        break;
    }
    return result;
  }
  return null;
};

export const convertToSql = (id, equipmentFilter) => {
    const sqlSentence = `UPDATE tenant_symphony.network_groups SET equipment_filter = '${JSON.stringify(equipmentFilter)}', progress = 'PENDING', status = 1 WHERE id = ${id || 'XXXX'}`;
    return sqlSentence
}   