document.addEventListener('DOMContentLoaded', () => {
  const jsonBuilder = document.getElementById('json-builder');
  const outputJson = document.getElementById('output-json');
  const getJsonButton = document.getElementById('get-json');
  const copyJsonButton = document.getElementById('copy-json');
  let propertyCounter = 1;

  function createPropertyBlock(level, isArrayItem = false, parentBlock = null) {
    const propertyBlock = document.createElement('div');
    propertyBlock.classList.add('property-block');
    propertyBlock.setAttribute('data-level', level);
    propertyBlock.setAttribute('data-id', propertyCounter++);
    propertyBlock.dataset.parentBlockId = parentBlock ? parentBlock.getAttribute('data-id') : null;


    if (level > 0) {
      propertyBlock.style.marginLeft = `${level * 20}px`;
    }


    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('property-actions');
    const delDiv = document.createElement('div');
    delDiv.classList.add('property-actions');

    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.classList.add('add-property');
    addButton.setAttribute('data-level', parseInt(level) + 1);
    addButton.addEventListener('click', (e) => {
      const level = e.target.getAttribute('data-level');
      const parentBlock = e.target.closest('.property-block');
      const type = parentBlock.querySelector('.property-type').value;
      if (type === 'object') {
         const newProp = createPropertyBlock(parseInt(level), false, parentBlock);
           // Encuentra el último bloque hijo del padre
         const lastChild = findLastChild(parentBlock);
            // Inserta el nuevo bloque después del último hijo
          if (lastChild) {
              lastChild.parentNode.insertBefore(newProp, lastChild.nextSibling);
            } else {
             // Si no hay hijos, simplemente inserta al final del contenedor
               parentBlock.parentNode.insertBefore(newProp, parentBlock.nextSibling);
              }
      } else if (type === 'enum') {
        createEnumOptions(parentBlock, level);
      }
    });
    actionsDiv.appendChild(addButton);

    if (level !== 0) {
      const arrayButton = document.createElement('button');
      arrayButton.textContent = '[]';
      arrayButton.classList.add('convert-array');
      arrayButton.setAttribute('data-level', level);
      arrayButton.addEventListener('click', () => {
        toggleArray(propertyBlock);
      });
      actionsDiv.appendChild(arrayButton);

      const requiredButton = document.createElement('button');
      requiredButton.textContent = '!';
      requiredButton.addEventListener('click', () => {
        propertyBlock.classList.toggle('required');
      });
      actionsDiv.appendChild(requiredButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.addEventListener('click', () => {
        propertyBlock.remove();
      });
      delDiv.appendChild(deleteButton);
    }

    let nameContainer;
    let nameInput;
    let explanationInput;
    if (level !== 0) {
      nameContainer = document.createElement('div');
      nameContainer.classList.add('property-name-container')

      nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.classList.add('property-name');
       nameInput.setAttribute('data-level', level);
      const namePlaceholder = document.createElement('span');
       namePlaceholder.classList.add('placeholder');
       namePlaceholder.textContent = 'Real Key';
      nameContainer.appendChild(nameInput);
      nameContainer.appendChild(namePlaceholder);

      explanationInput = document.createElement('input');
      explanationInput.type = 'text';
       explanationInput.classList.add('property-name');
       explanationInput.setAttribute('placeholder', 'Explanation Key');
      nameContainer.appendChild(explanationInput);

      nameInput.addEventListener('input', () => {
        namePlaceholder.classList.toggle('active', nameInput.value.trim() !== '')
      })
    }

    const typeSelect = document.createElement('select');
    typeSelect.classList.add('property-type');
    typeSelect.setAttribute('data-level', level);
    const types = ['object', 'string', 'number', 'integer', 'boolean', 'enum'];
    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      typeSelect.appendChild(option);
    });
    typeSelect.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      if (selectedValue === "enum") {
        createEnumOptions(propertyBlock, level);
      } else {
        const enumOptions = propertyBlock.querySelector('.enum-options');
        if (enumOptions) {
          enumOptions.remove();
        }
      }
      const addButton = propertyBlock.querySelector(".add-property");
      addButton.style.display = selectedValue === "object" ? "inline-block" : "none";
    });

    propertyBlock.appendChild(actionsDiv);
    if (nameContainer) {
      propertyBlock.appendChild(nameContainer);
    }

    propertyBlock.appendChild(typeSelect);
    propertyBlock.appendChild(delDiv);

    if (level === 0) {
      const nonEditableText = document.createElement('input');
      nonEditableText.type = 'text';
      nonEditableText.classList.add('property-name');
      nonEditableText.value = 'root';
      nonEditableText.readOnly = true;

      propertyBlock.appendChild(nonEditableText);
      typeSelect.style.display = 'none';
      propertyBlock.classList.add('root-block');
    }

    return propertyBlock;
  }

    function findLastChild(parentBlock) {
        const children = Array.from(jsonBuilder.querySelectorAll('.property-block'));
      let lastChild = null;
     let parentId = parentBlock.getAttribute('data-id');
       children.forEach(child => {
            if (child.dataset.parentBlockId == parentId) {
                lastChild = child;
            }
        });
        return lastChild;
    }
  function createEnumOptions(propertyBlock, level) {
    let enumOptions = propertyBlock.querySelector('.enum-options');
    if (!enumOptions) {
      enumOptions = document.createElement('div');
      enumOptions.classList.add('enum-options');
      propertyBlock.appendChild(enumOptions);

      const addEnumButton = document.createElement('button');
      addEnumButton.textContent = 'Add Option';
      addEnumButton.classList.add('add-enum-option');
      addEnumButton.addEventListener('click', () => {
        addEnumOption(enumOptions);
      });
      enumOptions.appendChild(addEnumButton)
    }
    addEnumOption(enumOptions);
  }


  function addEnumOption(enumOptions) {
    const enumOptionDiv = document.createElement('div');
    enumOptionDiv.classList.add('enum-option');
    const enumInput = document.createElement('input');
    enumInput.type = 'text';
    const enumPlaceholder = document.createElement('span');
    enumPlaceholder.classList.add('placeholder');
    enumPlaceholder.textContent = 'Option';
    enumOptionDiv.appendChild(enumInput);
    enumOptionDiv.appendChild(enumPlaceholder);


    const explanationInput = document.createElement('input');
    explanationInput.type = 'text';
    explanationInput.setAttribute('placeholder', 'Explanation Key');
    enumOptionDiv.appendChild(explanationInput);
    enumInput.addEventListener('input', () => {
      enumPlaceholder.classList.toggle('active', enumInput.value.trim() !== '')
    });


    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.addEventListener('click', () => {
      enumOptionDiv.remove();
    });
    enumOptionDiv.appendChild(deleteButton);
      enumOptions.insertBefore(enumOptionDiv, enumOptions.querySelector('.add-enum-option'));
  }

  function toggleArray(propertyBlock) {
    const convertArray = propertyBlock.querySelector('.convert-array');
    if (propertyBlock.dataset.isArrayItem === "true") {
      delete propertyBlock.dataset.isArrayItem;
      convertArray.textContent = "[]";
    } else {
      propertyBlock.dataset.isArrayItem = "true";
      convertArray.textContent = "{}";
    }
  }

  function buildJson(element, level = 0) {
    let json = {};

    if (element.classList.contains('property-block')) {
      const type = element.querySelector('.property-type').value;
      const nameInput = element.querySelector('.property-name');
      const explanationInput = element.querySelectorAll('.property-name')[1];
      let name = level > 0 ? nameInput?.value : null;
      let explanationKey = explanationInput?.value || null;

      if (element.dataset.isArrayItem === "true") {
        json = {
          type: "array",
          items: {}
        };
        if (type === "object") {
          json.items.type = "object";
          json.items.properties = {};
        } else if (type === "enum") {
          json.items.type = "string";
          json.items.enum = getEnumOptions(element);
        } else {
          json.items.type = type;
        }
      } else {
        if (type === "object") {
          json.type = "object";
          json.properties = {};
        } else if (type === "enum") {
          json.type = "string";
          json.enum = getEnumOptions(element);
        } else {
          json.type = type;
        }
      }

      if (explanationKey) {
        json.description = explanationKey;
      }

      if (type === "object") {
        const children = Array.from(jsonBuilder.querySelectorAll('.property-block'));
        children.forEach(child => {
            if (child.dataset.parentBlockId == element.getAttribute('data-id')) {
             const childJson = buildJson(child, level + 1);
              const childNameInput = child.querySelector('.property-name');
                if(childNameInput){
                    const childName = childNameInput.value;
                    if (childName) {
                        if (json.type === "object") {
                          json.properties[childName] = childJson;
                        } else if (json.items) {
                            json.items.properties[childName] = childJson;
                        }
                    }
                }
           }
        });
      }

      if (element.classList.contains('required') && name) {
        if (!json.required) json.required = [];
        json.required.push(name);
      }

      if (name)
        json.real_key = name;
    }

    return json;
  }

    function getEnumOptions(element) {
     const enumOptions = element.querySelector('.enum-options');
        if (enumOptions) {
           return Array.from(enumOptions.querySelectorAll('.enum-option')).map(optionDiv => {
               const inputElement = optionDiv.querySelector('input[type="text"]');
              const explanationInput = optionDiv.querySelectorAll('input[type="text"]')[1];
              return {
                  real_key: inputElement ? inputElement.value : '',
                  explanation_key: explanationInput ? explanationInput.value : ''
              };
          });
        }
        return [];
    }


  const rootBlock = createPropertyBlock(0, false, null);
    jsonBuilder.appendChild(rootBlock);

    getJsonButton.addEventListener('click', () => {
      const main = buildJson(rootBlock);
      outputJson.textContent = JSON.stringify(main, null, 2);
    });

    copyJsonButton.addEventListener('click', () => {
      const jsonText = outputJson.textContent;
      navigator.clipboard.writeText(jsonText).then(() => {
        alert('JSON Copied to Clipboard!');
      }).catch(err => {
        console.error('Failed to copy JSON: ', err);
        alert('Failed to copy JSON, please try again.');
      });
    });
  });