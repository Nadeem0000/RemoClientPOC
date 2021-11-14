import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RemoDepartmentGalleryWebPartStrings';
import RemoDepartmentGallery from './components/RemoDepartmentGallery';
import { IRemoDepartmentGalleryProps } from './components/IRemoDepartmentGalleryProps';

export interface IRemoDepartmentGalleryWebPartProps {
  description: string;
}

export default class RemoDepartmentGalleryWebPart extends BaseClientSideWebPart<IRemoDepartmentGalleryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRemoDepartmentGalleryProps> = React.createElement(
      RemoDepartmentGallery,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
